import { PlayerSmall } from "../models/PlayerSmall";
import { Team } from "../models/Team";
import { Role, Status, Visibility } from "../utilities/enums";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";

export default class TeamDAO {
    readonly className = this.constructor.name;

    /**
     * Finds a list of all details of a team within an Organization
     * @param id string of the Organization
     * @returns List of Teams
     */
    async findAllTeamsByOrganizationId(id: string): Promise<Team[]> {
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM team WHERE organization_id=$1";

        return withClient(async (querier) => {
            const response = await querier(sqlAll, [id]);
            const results = response.rows;

            return results.map(
                (team) =>
                    new Team({
                        id: team.id,
                        name: team.name,
                        wins: team.wins,
                        ties: team.ties,
                        losses: team.losses,
                        image: team.image,
                        visibility: team.visibility,
                        sport: team.sport,
                        dateCreated: team.date_created,
                        sportsmanshipScore: team.sportsmanship_score,
                        status: team.status,
                        maxTeamSize: team.max_team_size,
                        players: [],
                        organizationId: team.organization_id,
                        bracketId: null,
                    })
            );
        });
    }

    async findAllTeamsByPlayerId(id: string): Promise<Team[]> {
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
        });

        const sqlAll =
            "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.SPORT, team.DATE_CREATED, team.MAX_TEAM_SIZE, tr.ROLE, tr.player_AUTH_ID, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on(team.ID = tr.team_ID) JOIN player player on(tr.player_AUTH_ID = player.AUTH_ID) WHERE tr.team_ID IN (SELECT team_ID FROM team_roster WHERE player_AUTH_ID = ?) ORDER BY tr.team_ID ASC";

        return withClient(async (querier) => {
            const response = await querier<Team>(sqlAll, [id]);

            const results = response.rows;

            console.log(results);

            return results;
        });
    }

    async findAllTeams(): Promise<Team[] | null> {
        logger.verbose("Entering method findAllTeams()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM team";

        return withClient(async (querier) => {
            const response = await querier<Team>(sqlAll);
            const results = response.rows;

            console.log(results);

            return results;
        });
    }

    async findTeamByIdWithPlayers(teamId: number): Promise<Team | null> {
        logger.verbose("Entering method findTeamByIdWithPlayers()", {
            class: this.className,
        });

        const sqlFind = "SELECT * FROM team WHERE id = $1";
        const sqlFindPlayers =
            "SELECT team_roster.role, player.auth_id, player.first_name, player.last_name, player.gender, player.status, player.image FROM team_roster JOIN player ON team_roster.player_AUTH_ID = player.auth_ID WHERE team_roster.team_ID = $1";

        return withClient(async (querier) => {
            const players = (await querier(sqlFindPlayers, [teamId])).rows;

            if (players.length === 0) {
                return null;
            }

            const playerList = players.map(
                (player) =>
                    new PlayerSmall(
                        player.auth_id,
                        player.role,
                        player.first_name,
                        player.last_name,
                        player.gender,
                        player.status,
                        player.image
                    )
            );

            const [team] = (await querier(sqlFind, [teamId])).rows;
            if (team === undefined) {
                return null;
            }

            return new Team({
                id: team.id,
                name: team.name,
                wins: team.wins,
                ties: team.ties,
                losses: team.losses,
                image: team.image,
                visibility: team.visibility,
                sport: team.sport,
                dateCreated: team.date_created,
                sportsmanshipScore: team.sportsmanship_score,
                status: team.status,
                maxTeamSize: team.max_team_size,
                players: playerList,
                organizationId: team.organization_id,
                bracketId: null,
            });
        });
    }

    async findTeamById(teamId: number): Promise<Team | null> {
        logger.verbose("Entering method findTeamById()", {
            class: this.className,
        });

        const sqlFind = "SELECT * FROM team WHERE id = $1";

        return withClient(async (querier) => {
            const response = await querier(sqlFind, [teamId]);

            const [team] = response.rows;

            if (response === undefined) {
                return null;
            }

            return new Team({
                id: team.id,
                name: team.name,
                wins: team.wins,
                ties: team.ties,
                losses: team.losses,
                image: team.image,
                visibility: team.visibility,
                sport: team.sport,
                dateCreated: team.date_created,
                sportsmanshipScore: team.sportsmanship_score,
                status: team.status,
                maxTeamSize: team.max_team_size,
                players: [],
                organizationId: team.organization_id,
                bracketId: null,
            });
        });
    }

    async updateTeam(team: Team): Promise<Team | null> {
        logger.verbose("Entering method updateTeam()", {
            class: this.className,
            values: team,
        });

        const sqlUpdate =
            "UPDATE team SET name=$1, wins=$2, ties=$3, losses=$4, image=$5, visibility=$6, sport=$7, sportsmanship_score=$8, status=$9, max_team_size=$10 WHERE id = $11 RETURNING *";

        return withClient(async (querier) => {
            const response = await querier(sqlUpdate, [
                team.getName(),
                team.getWins(),
                team.getTies(),
                team.getLosses(),
                team.getImage(),
                team.getVisibility(),
                team.getSport(),
                team.getSportsmanshipScore(),
                team.getStatus(),
                team.getMaxTeamSize(),
                team.getId(),
            ]);
            const [results] = response.rows;

            if (results === undefined) {
                return null;
            }

            return new Team({
                id: results.id,
                name: results.name,
                wins: results.wins,
                ties: results.ties,
                losses: results.losses,
                image: results.image,
                visibility: results.visibility,
                sport: results.sport,
                dateCreated: results.date_created,
                sportsmanshipScore: results.sportsmanship_score,
                status: results.status,
                maxTeamSize: results.max_team_size,
                players: [],
                organizationId: results.organization_id,
                bracketId: null,
            });
        });
    }

    async createTeam(team: Team, playerId: string): Promise<Team | null> {
        logger.verbose("Entering method createTeam()", {
            class: this.className,
            values: team,
        });

        const sqlAdd =
            "INSERT INTO team (name, wins, ties, losses, image, visibility, sport, sportsmanship_score, status, max_team_size, organization_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";

        const sqlAddCaptain =
            "INSERT INTO team_roster (player_auth_id, team_id, role) VALUES($1, $2, $3)";

        const result = await withClientRollback(async (querier) => {
            const returnedTeam = await querier(sqlAdd, [
                team.getName(),
                team.getWins(),
                team.getTies(),
                team.getLosses(),
                team.getImage(),
                team.getVisibility(),
                team.getSport(),
                team.getSportsmanshipScore(),
                team.getStatus(),
                team.getMaxTeamSize(),
                team.getOrganizationId(),
            ]);
            const [results] = returnedTeam.rows;

            if (results === undefined) {
                return IsRollback;
            }

            const rosterAdd = await querier(sqlAddCaptain, [playerId, results.id, Role.CAPTAIN]);

            if (rosterAdd.rowCount === 0) {
                return IsRollback;
            }

            return new Team({
                id: results.id,
                name: results.name,
                wins: results.wins,
                ties: results.ties,
                losses: results.losses,
                image: results.image,
                visibility: results.visibility,
                sport: results.sport,
                dateCreated: results.date_created,
                sportsmanshipScore: results.sportsmanship_score,
                status: results.status,
                maxTeamSize: results.max_team_size,
                players: [],
                organizationId: results.organization_id,
                bracketId: null,
            });
        });

        if (result === IsRollback) {
            return null;
        }

        return result;
    }

    async addToTeamRoster(teamId: number, playerId: string, role: Role): Promise<boolean> {
        logger.verbose("Entering method addToTeamRoster()", {
            class: this.className,
        });

        const sqlAddPlayer =
            "INSERT INTO team_roster (player_AUTH_ID, team_ID, role) VALUES ($1, $2, $3)";

        return withClient(async (querier) => {
            const responseAdd = await querier(sqlAddPlayer, [playerId, teamId, role]);

            if (responseAdd === null) {
                return false;
            }

            return true;
        });
    }

    async removeFromTeamRoster(teamId: number, playerId: string): Promise<boolean> {
        logger.verbose("Entering method removeFromTeamRoster()", {
            class: this.className,
        });

        const sqlRemove = "DELETE FROM team_roster WHERE player_AUTH_ID=$1 AND team_ID=$2";

        return withClient(async (querier) => {
            const response = await querier(sqlRemove, [playerId, teamId]);

            if (response === null) {
                return false;
            }

            if (response.rowCount > 1) {
                logger.error("removeFromTeamRoster deleted more than one record", {
                    class: this.className,
                    values: {
                        playerId,
                        teamId,
                    },
                });
            }

            return true;
        });
    }

    async updateTeamRoster(teamId: number, playerId: string, role: Role): Promise<boolean> {
        logger.verbose("Entering method updateToTeamRoster()", {
            class: this.className,
            values: teamId,
            playerId,
            role,
        });

        const sqlUpdate = "UPDATE team_roster SET ROLE=$1 WHERE team_ID=$2, AND player_AUTH_ID=$3";

        return withClient(async (querier) => {
            const response = await querier(sqlUpdate, [role, teamId, playerId]);

            const [results] = response.rows;

            if (results === undefined) {
                return false;
            }

            return true;
        });
    }

    async createJoinRequest(
        teamId: number,
        playerId: string,
        expirationTime: Date
    ): Promise<boolean> {
        logger.verbose("Entering method createJoinRequest()", {
            class: this.className,
            values: teamId,
            playerId,
        });

        const sqlAdd =
            "INSERT INTO team_join_requests (player_auth_id, team_id, requesting_player_full_name, expiration_time) VALUES ($1,$2,$3,$4) RETURNING *";

        const sqlPlayer = "SELECT first_name, last_name FROM player WHERE auth_id = $1";

        return withClient(async (querier) => {
            const [player] = (await querier(sqlPlayer, [playerId])).rows;
            if (player === undefined) {
                return false;
            }

            const [result] = (
                await querier(sqlAdd, [
                    playerId,
                    teamId,
                    `${player.first_name} ${player.last_name}`,
                    expirationTime,
                ])
            ).rows;

            if (result === undefined) {
                return false;
            }

            return true;
        });
    }

    async deleteJoinRequest(playerId: string, teamId: number): Promise<boolean> {
        logger.verbose("Entering method deleteJoinRequest()", {
            class: this.className,
            values: teamId,
            playerId,
        });

        const sqlDelete =
            "DELETE FROM team_join_requests WHERE player_auth_id = $1 AND team_id = $2";

        return withClient(async (querier) => {
            const results = (await querier(sqlDelete, [playerId, teamId])).rowCount;

            if (results === 0) {
                return false;
            }

            return true;
        });
    }
}

const test = new TeamDAO();
// test.findAllTeamsByPlayerId()
// test.findAllTeams();
// test.findTeamById(12)

const team = new Team({
    id: 20,
    name: "Hello Barbie",
    wins: 0,
    ties: 0,
    losses: 0,
    image: "",
    visibility: Visibility.OPEN,
    sport: "Soccer",
    dateCreated: null,
    sportsmanshipScore: 4.0,
    status: Status.ACTIVE,
    maxTeamSize: 12,
    players: [],
    organizationId: "7f83b6f4-754a-4f34-913d-907c1226321f",
    bracketId: null,
});

testFunc();

async function testFunc() {
    // test.createJoinRequest(12, "player4");
    // await test.findTeamByIdWithPlayers(12);
    // console.log(await test.addToTeamRoster(12, "player4", Role.PLAYER))
    // console.log(await test.removeFromTeamRoster(12, "player2"));
    // const newTeam = await test.updateTeam(team);
    // const newTeam = await test.createTeam(team)
    // console.log(newTeam?.getId());
    // console.log(await test.findTeamById(12));
}
