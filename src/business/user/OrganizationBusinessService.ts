import AdminDAO from "../../data/adminDAO";
import OrganizationDAO from "../../data/organizationDAO";
import { Admin } from "../../models/Admin";
import { APIResponse } from "../../models/APIResponse";
import { Tournament } from "../../models/competition/Tournament";
import { TournamentGame } from "../../models/competition/TournamentGame";
import { Organization } from "../../models/Organization";
import { getBracket } from "../../utilities/bracketGenerator";
import { TournamentGameStatus, TournamentType } from "../../utilities/enums/competitionEnum";
import logger from "../../utilities/winstonConfig";
import PlayerDAO from "../../data/playerDAO";
import { Player } from "../../models/Player";
import TeamDAO from "../../data/teamDAO";
import { Team } from "../../models/Team";

const organizationDatabase = new OrganizationDAO();
const adminDatabase = new AdminDAO();
const playerDatabase = new PlayerDAO();
const teamDatabase = new TeamDAO();

export class OrganizationBusinessService {
    private readonly className = this.constructor.name;

    /**
     * Searches for organization with admin id
     * @param adminId - id of admin to search with
     * @returns - error response or Organization object
     */
    async findOrganizationByAdminId(adminId: string): Promise<APIResponse | Organization> {
        logger.verbose("Entering method findOrganizationByAdminId()", {
            class: this.className,
            values: adminId,
        });

        const organization = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (organization === null) {
            return APIResponse.NotFound(`No organization found with admin id: ${adminId}`);
        }

        return organization;
    }

    /**
     * Patches organization admin is under
     * @param adminId - id of admin to look for organization with
     * @returns - error response or Organization object. Currently returns not implemented response
     */
    async patchOrganizationByAdminId(adminId: string): Promise<APIResponse | Organization> {
        logger.verbose("Entering method patchOrganizationByAdminId()", {
            class: this.className,
            values: adminId,
        });

        const admin = await adminDatabase.findAdminById(adminId);
        if (admin === null) {
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        // need to create patch method for organization
        // const organization = await organizationDatabase.updateOrganization();

        return APIResponse.NotImplemented();
    }

    /**
     * Finds all player under organization using admin id
     * @param adminId - id of admin to look for organization with
     * @returns - error response or Player list
     */
    async findAllPlayersByAdminId(adminId: string): Promise<APIResponse | Player[]> {
        logger.verbose("Entering method findAllPlayersByAdminId()", {
            class: this.className,
            values: adminId,
        });

        const organization = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (organization === null) {
            return APIResponse.NotFound(`No organization found with admin id: ${adminId}`);
        }

        const players = await playerDatabase.findAllPlayersByOrganizationId(organization.getId());
        if (players.length === 0) {
            return APIResponse.NotFound(
                `No players found with organization id: ${organization.getId()}`
            );
        }

        return players;
    }

    /**
     * Finds all teams under organization regardless of status
     * @param adminId - id of admin to look for organization with
     * @returns - error response or team list
     */
    async findAllTeamsByAdminId(adminId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findAllTeamsByAdminId()", {
            class: this.className,
            values: adminId,
        });

        const organization = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (organization === null) {
            return APIResponse.NotFound(`No organization found with admin id: ${adminId}`);
        }

        const teams = await teamDatabase.findAllTeamsByOrganizationId(organization.getId());
        if (teams.length === 0) {
            return APIResponse.NotFound(
                `No teams found with organization id: ${organization.getId()}`
            );
        }

        return teams;
    }

    /**
     * Finds all admins under organization
     * @param adminId - id of admin to look for organization with
     * @returns - error response or admin list
     */
    async findAllAdminsByAdminId(adminId: string): Promise<APIResponse | Admin[]> {
        logger.verbose("Entering method findAllAdminsByAdminId()", {
            class: this.className,
            values: adminId,
        });

        const organization = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (organization === null) {
            return APIResponse.NotFound(`No organization found with admin id: ${adminId}`);
        }

        const admins = await adminDatabase.findAllAdminsByOrganizationId(organization.getId());
        if (admins.length === 0) {
            return APIResponse.NotFound(
                `No admins found with organization id: ${organization.getId()}`
            );
        }

        return admins;
    }

    // tournament visualizer = https://brackethq.com/maker/

    // REVISIT - These tournament methods need some major rework but i'm leaving them in here for now

    // async generatePlayoff() {}

    /**
     * Requires a list of participants, their seeds, and tournament details to create a new Tournament
     * and its games. For generating a tournament based on a league, please use generatePlayoff()
     * @param tournament
     * @param teams
     */
    async createTournament(
        tournament: Tournament,
        teams: number[]
    ): Promise<Tournament | APIResponse> {
        return APIResponse.NotImplemented();
        // const newTournament = await competitionDatabase.createTournament(tournament);
        // if (newTournament === null) {
        //     return APIResponse[500]("Error creating tournament");
        // }

        // const gameList: TournamentGame[] = await this.generateTournament(newTournament, teams);
        // if (gameList.length === 0) {
        //     return APIResponse[500]("Error generating tournament");
        // }

        // const newGames = await competitionDatabase.createTournamentGames(gameList);
        // if (newGames.length === 0) {
        //     return APIResponse[500]("Error creating games");
        // }

        // newTournament.setGames(newGames);
        // return newTournament;
    }

    // async generateTournament(tournament: Tournament, teams: [teamId: number, teamSeed: number]) {
    // eslint-disable-next-line class-methods-use-this
    async generateTournament(tournament: Tournament, teams: number[]): Promise<TournamentGame[]> {
        // will return if there are not an even number of teams to make a bracket.
        // todo: support byes
        if (teams.length % 4 !== 0) {
            return [];
        }

        const generatedList = getBracket(teams);
        const gameList: TournamentGame[] = [];

        switch (tournament.getTournamentType()) {
            case TournamentType.SINGLE: {
                console.log("SINGLE");
                let totalNumberOfGames = teams.length - 1;
                // first loop creates first round games with seeds
                for (let x = 0; x < generatedList.length; x++) {
                    // random number pulls random team from list then splices it out of list
                    const randomNumberOne = Math.floor(Math.random() * teams.length);
                    const homeTeam = teams[randomNumberOne];
                    teams.splice(randomNumberOne, 1);

                    const randomNumberTwo = Math.floor(Math.random() * teams.length);
                    const awayTeam = teams[randomNumberTwo];
                    teams.splice(randomNumberTwo, 1);

                    // the two random teams are now placed into a game with seed info
                    gameList.push(
                        new TournamentGame({
                            id: null,
                            dateCreated: null,
                            gameDate: null,
                            location: "GCU",
                            locationDetails: "",
                            scoreHome: 0,
                            scoreAway: 0,
                            seedHome: generatedList[x][0],
                            seedAway: generatedList[x][1],
                            statusHome: TournamentGameStatus.NOTPLAYED,
                            statusAway: TournamentGameStatus.NOTPLAYED,
                            level: x,
                            round: 1,
                            homeTeamId: homeTeam,
                            awayTeamId: awayTeam,
                            tournamentId: tournament.getId()!,
                        })
                    );
                    totalNumberOfGames--;
                }

                // rest of tournament games are created here
                let round = 2;
                while (totalNumberOfGames > 0) {
                    const remainingGames = totalNumberOfGames / 2;
                    for (let x = 0; x < remainingGames; x++) {
                        gameList.push(
                            new TournamentGame({
                                id: null,
                                dateCreated: null,
                                gameDate: null,
                                location: "GCU",
                                locationDetails: "",
                                scoreHome: 0,
                                scoreAway: 0,
                                seedHome: 0,
                                seedAway: 0,
                                statusHome: TournamentGameStatus.TOBEDETERMINED,
                                statusAway: TournamentGameStatus.TOBEDETERMINED,
                                level: x,
                                round,
                                homeTeamId: null,
                                awayTeamId: null,
                                tournamentId: tournament.getId()!,
                            })
                        );
                        totalNumberOfGames--;
                    }
                    round++;
                }

                break;
            }
            case TournamentType.DOUBLE:
                console.log("DOUBLE");
                break;
            case TournamentType.ROUNDROBIN:
                console.log("ROUND ROBIN");
                break;
            default: {
                console.log("RANDOM");
                break;
            }
        }
        return gameList;
    }
}

const test = new OrganizationBusinessService();

testFunc();

async function testFunc() {
    // await test.createTournament(
    //     new Tournament({
    //         id: null,
    //         name: "My Tourney",
    //         visibility: Visibility.CLOSED,
    //         status: Status.ACTIVE,
    //         numberOfTeams: 2,
    //         dateCreated: null,
    //         startDate: new Date(),
    //         endDate: new Date(),
    //         tournamentType: TournamentType.SINGLE,
    //         sport: "soccer",
    //         games: [],
    //         organizationId: "03503875-f4a2-49f6-bb9f-e9a22fb852d4",
    //     }),
    //     [4, 10, 12]
    // );
    // await test.generateTournament(
    //     new Tournament({
    //         id: null,
    //         name: "My Tourney",
    //         visibility: Visibility.CLOSED,
    //         status: Status.ACTIVE,
    //         numberOfTeams: 2,
    //         dateCreated: null,
    //         startDate: new Date(),
    //         endDate: new Date(),
    //         tournamentType: TournamentType.RANDOM,
    //         sport: "soccer",
    //         games: [],
    //         organizationId: "03503875-f4a2-49f6-bb9f-e9a22fb852d4",
    //     }),
    //     [21, 22, 23, 24, 25, 26, 27, 28]
    // );
}
