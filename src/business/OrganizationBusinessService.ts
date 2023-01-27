import CompetitionDAO from "../data/competitionDAO";
import OrganizationDAO from "../data/organizationDAO";
import { Admin } from "../models/Admin";
import { APIResponse } from "../models/APIResponse";
import { Tournament } from "../models/competition/Tournament";
import { TournamentGame } from "../models/competition/TournamentGame";
import { Organization } from "../models/Organization";
import { getBracket } from "../utilities/bracketGenerator";
import { Role, Status, TournamentStatus, TournamentType, Visibility } from "../utilities/enums";
import { OrgWithAdmin } from "../utilities/interfaces";
import logger from "../utilities/winstonConfig";

const organizationDatabase = new OrganizationDAO();
const competitionDatabase = new CompetitionDAO();

export class OrganizationBusinessService {
    private readonly className = this.constructor.name;

    async createOrganization(
        organization: Organization,
        admin: Admin
    ): Promise<APIResponse | OrgWithAdmin> {
        logger.verbose("Entering method createOrganization()", {
            class: this.className,
            values: {
                organization,
                admin,
            },
        });

        // default values for this query give the admin a generic name if once isn't provided
        // role is automatically set to MASTER for the first admin
        // statu is set to active
        const newAdmin: Admin = new Admin(
            admin.getAuthId(),
            admin.getFirstName() || `${organization.getName()} Master Administrator`,
            admin.getLastName() || "",
            admin.getLanguage(),
            admin.getEmailAddress(),
            Role.MASTER,
            null,
            Status.ACTIVE,
            ""
        );

        const response = await organizationDatabase.createOrganization(organization, newAdmin);
        if (response === null) {
            return APIResponse[500]("Error creating organization");
        }

        return response;
    }

    // tournament visualizer = https://brackethq.com/maker/

    // async createOrganizationWithAuth0Account() {}

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
        const newTournament = await competitionDatabase.createTournament(tournament);
        if (newTournament === null) {
            return APIResponse[500]("Error creating tournament");
        }

        const gameList: TournamentGame[] = await this.generateTournament(newTournament, teams);
        if (gameList.length === 0) {
            return APIResponse[500]("Error generating tournament");
        }

        const newGames = await competitionDatabase.createTournamentGames(gameList);
        if (newGames.length === 0) {
            return APIResponse[500]("Error creating games");
        }

        newTournament.setGames(newGames);
        return newTournament;
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
                            statusHome: TournamentStatus.NOTPLAYED,
                            statusAway: TournamentStatus.NOTPLAYED,
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
                                statusHome: TournamentStatus.TOBEDETERMINED,
                                statusAway: TournamentStatus.TOBEDETERMINED,
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
