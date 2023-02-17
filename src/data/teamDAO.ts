import format from "pg-format";
import { TeamDatabaseInterface } from "../interfaces/Team";
import { PlayerSmall } from "../models/PlayerSmall";
import { Team } from "../models/Team";
import { TeamRole } from "../utilities/enums/teamEnum";
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

    /**
     * Returns list of teams that player is on
     * @param id - id to search for teams with
     * @returns - list of teams
     */
    async findAllTeamsByPlayerId(id: string): Promise<Team[]> {
        logger.verbose("Entering method findAllTeamsByPlayerId()", {
            class: this.className,
        });

        const sqlTeam = `SELECT team.ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.SPORT, team.SPORTSMANSHIP_SCORE, team.STATUS, team.DATE_CREATED, team.MAX_TEAM_SIZE, team.bracket_ID, team.organization_id
        FROM team team 
        JOIN team_roster tr on(team.ID = tr.team_ID) 
        JOIN player player on(tr.player_AUTH_ID = player.AUTH_ID) 
        WHERE tr.team_ID IN (SELECT team_ID FROM team_roster WHERE player_AUTH_ID = $1) ORDER BY tr.team_ID ASC`;

        const sqlFindPlayers =
            "SELECT team_roster.team_id, team_roster.role, player.auth_id, player.first_name, player.last_name, player.gender, player.status, player.image FROM team_roster JOIN player ON team_roster.player_AUTH_ID = player.auth_ID WHERE team_roster.team_ID IN (%L)";

        const result = await withClientRollback(async (querier) => {
            // first a query to find teams is performed
            const teams = (await querier<TeamDatabaseInterface>(sqlTeam, [id])).rows;
            const teamIdList = teams.map((x) => x.id);

            // next using the team ids from above each player on the team is retrieved
            const players = (await querier(format(sqlFindPlayers, teamIdList))).rows;

            return teams.map((team) => {
                const playerList = players
                    .filter((player) => player.team_id === team.id)
                    .map(
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
        });

        if (result === IsRollback) {
            return [];
        }

        return result;
    }

    /**
     * Finds all teams in organization, ignores any status
     * @returns - list of teams
     */
    async findAllTeams(): Promise<Team[]> {
        logger.verbose("Entering method findAllTeams()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM team";

        return withClient(async (querier) => {
            const teams = (await querier<Team>(sqlAll)).rows;

            return teams;
        });
    }

    /**
     * Returns team details with player list
     * @param teamId - id to search for team with
     * @returns - team object with players or null
     */
    async findTeamByIdWithPlayers(teamId: number): Promise<Team | null> {
        logger.verbose("Entering method findTeamByIdWithPlayers()", {
            class: this.className,
        });

        // todo: combine into one query
        const sqlFind = "SELECT * FROM team WHERE id = $1";
        const sqlFindPlayers =
            "SELECT team_roster.role, player.auth_id, player.first_name, player.last_name, player.gender, player.status, player.image FROM team_roster JOIN player ON team_roster.player_AUTH_ID = player.auth_ID WHERE team_roster.team_ID = $1";

        const result = await withClientRollback(async (querier) => {
            // first fetches all players on team
            const players = (await querier(sqlFindPlayers, [teamId])).rows;

            if (players.length === 0) {
                return IsRollback;
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

            // next fetches team details then combines the two
            const [team] = (await querier(sqlFind, [teamId])).rows;
            if (team === undefined) {
                return IsRollback;
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

        if (result === IsRollback) {
            return null;
        }
        return result;
    }

    /**
     * Returns team details without player list. May be removed in favor of returning team list
     * @param teamId - id to search for team with
     * @returns - team object or null
     */
    async findTeamById(teamId: number): Promise<Team | null> {
        logger.verbose("Entering method findTeamById()", {
            class: this.className,
            values: teamId,
        });

        const sqlFind = "SELECT * FROM team WHERE id = $1";

        return withClient(async (querier) => {
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
                players: [],
                organizationId: team.organization_id,
                bracketId: null,
            });
        });
    }

    async removeTeamById(teamId: number): Promise<boolean> {
        logger.verbose("Entering method removeTeamById()", {
            class: this.className,
            values: teamId,
        });

        const sqlDelete = "DELETE FROM team WHERE id = $1";

        return withClient(async (querier) => {
            const response = await querier(sqlDelete, [teamId]);
            if (response.rowCount === 0) {
                return false;
            }

            return true;
        });
    }

    /**
     * Patches team in database, only changing variables that are different
     * @param team - team object to be patched
     * @returns - newly patched team object or null
     */
    async patchTeam(team: Team): Promise<Team | null> {
        logger.verbose("Entering method patchTeam()", {
            class: this.className,
            values: team,
        });

        const name = team.getName() || null;
        const image = team.getImage() || null;

        const sqlPatch =
            "UPDATE team SET name=COALESCE($1, name), wins=COALESCE($2, wins), ties=COALESCE($3, ties), losses=COALESCE($4, losses), image=COALESCE($5, image), visibility=COALESCE($6, visibility), sport=COALESCE($7, sport), sportmanship_score=COALESCE($8, sportmanship_score), status=COALESCE($9, status), max_team_size=COALESCE($10, max_team_size), bracket_ID=COALESCE($11, bracket_ID) WHERE auth_id=$11 RETURNING *";

        return withClient(async (querier) => {
            const [response] = (
                await querier<TeamDatabaseInterface>(sqlPatch, [
                    name,
                    team.getWins(),
                    team.getTies(),
                    team.getLosses(),
                    image,
                    team.getVisibility(),
                    team.getSport(),
                    team.getSportsmanshipScore(),
                    team.getStatus(),
                    team.getMaxTeamSize(),
                    team.getBracketId(),
                ])
            ).rows;

            if (response === undefined) {
                return null;
            }

            return new Team({
                id: response.id,
                name: response.name,
                wins: response.wins,
                ties: response.ties,
                losses: response.losses,
                image: response.image,
                visibility: response.visibility,
                sport: response.sport,
                dateCreated: response.date_created,
                sportsmanshipScore: response.sportsmanship_score,
                status: response.status,
                maxTeamSize: response.max_team_size,
                players: [],
                organizationId: response.organization_id,
                bracketId: response.bracket_id,
            });
        });
    }

    // commented out for now. I prefer patch over updating so I don't know if this
    // method will stay
    // async updateTeam(team: Team): Promise<Team | null> {
    //     logger.verbose("Entering method updateTeam()", {
    //         class: this.className,
    //         values: team,
    //     });

    //     const sqlUpdate =
    //         "UPDATE team SET name=$1, wins=$2, ties=$3, losses=$4, image=$5, visibility=$6, sport=$7, sportsmanship_score=$8, status=$9, max_team_size=$10 WHERE id = $11 RETURNING *";

    //     return withClient(async (querier) => {
    //         const response = await querier(sqlUpdate, [
    //             team.getName(),
    //             team.getWins(),
    //             team.getTies(),
    //             team.getLosses(),
    //             team.getImage(),
    //             team.getVisibility(),
    //             team.getSport(),
    //             team.getSportsmanshipScore(),
    //             team.getStatus(),
    //             team.getMaxTeamSize(),
    //             team.getId(),
    //         ]);
    //         const [results] = response.rows;

    //         if (results === undefined) {
    //             return null;
    //         }

    //         return new Team({
    //             id: results.id,
    //             name: results.name,
    //             wins: results.wins,
    //             ties: results.ties,
    //             losses: results.losses,
    //             image: results.image,
    //             visibility: results.visibility,
    //             sport: results.sport,
    //             dateCreated: results.date_created,
    //             sportsmanshipScore: results.sportsmanship_score,
    //             status: results.status,
    //             maxTeamSize: results.max_team_size,
    //             players: [],
    //             organizationId: results.organization_id,
    //             bracketId: null,
    //         });
    //     });
    // }

    /**
     * Creates new team and adds player as captain
     * @param team - team object to be added
     * @param playerId - creating player to make captain of team
     * @returns - team object or null
     */
    async createTeam(team: Team, playerId: string): Promise<Team | null> {
        logger.verbose("Entering method createTeam()", {
            class: this.className,
            values: { team, playerId },
        });

        // todo: combine into one query
        const sqlAdd =
            "INSERT INTO team (name, wins, ties, losses, image, visibility, sport, sportsmanship_score, status, max_team_size, organization_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";

        const sqlAddCaptain =
            "INSERT INTO team_roster (player_auth_id, team_id, role) VALUES($1, $2, $3)";

        // this is all done in a transaction
        const result = await withClientRollback(async (querier) => {
            // first team is created to get id
            const [newTeam] = (
                await querier<TeamDatabaseInterface>(sqlAdd, [
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
                ])
            ).rows;

            if (newTeam === undefined) {
                return IsRollback;
            }

            // next player is added to team roster with captain role
            const rosterAdd = await querier(sqlAddCaptain, [
                playerId,
                newTeam.id,
                TeamRole.CAPTAIN,
            ]);

            if (rosterAdd.rowCount === 0) {
                return IsRollback;
            }

            return new Team({
                id: newTeam.id,
                name: newTeam.name,
                wins: newTeam.wins,
                ties: newTeam.ties,
                losses: newTeam.losses,
                image: newTeam.image,
                visibility: newTeam.visibility,
                sport: newTeam.sport,
                dateCreated: newTeam.date_created,
                sportsmanshipScore: newTeam.sportsmanship_score,
                status: newTeam.status,
                maxTeamSize: newTeam.max_team_size,
                players: [],
                organizationId: newTeam.organization_id,
                bracketId: null,
            });
        });

        if (result === IsRollback) {
            return null;
        }

        return result;
    }

    /**
     * Player is added to team roster with a role attached
     * @param teamId - team id to add player to
     * @param playerId - player to be added to team
     * @param role - role attached to player
     * @returns - true or false depending on success or failure
     */
    async addToTeamRoster(teamId: number, playerId: string, role: TeamRole): Promise<boolean> {
        logger.verbose("Entering method addToTeamRoster()", {
            class: this.className,
            values: { teamId, playerId },
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

    /**
     * Player is removed from team roster
     * @param teamId - id of team
     * @param playerId - id of player to remove from team
     * @returns - true or false based on success or failure
     */
    async removeFromTeamRoster(teamId: number, playerId: string): Promise<boolean> {
        logger.verbose("Entering method removeFromTeamRoster()", {
            class: this.className,
            values: { teamId, playerId },
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

    /**
     * Updates role for player on team roster
     * @param teamId - id of team to update
     * @param playerId - id of player to change role
     * @param role - new role of player
     * @returns - true or false based on success or failure
     */
    async updateTeamRoster(teamId: number, playerId: string, role: TeamRole): Promise<boolean> {
        logger.verbose("Entering method updateTeamRoster()", {
            class: this.className,
            values: { teamId, playerId, role },
        });

        const sqlUpdate = "UPDATE team_roster SET ROLE=$1 WHERE team_ID=$2 AND player_AUTH_ID=$3";

        return withClient(async (querier) => {
            const response = await querier(sqlUpdate, [role, teamId, playerId]);

            const [results] = response.rows;

            if (results === undefined) {
                return false;
            }

            return true;
        });
    }

    /**
     * Creates new request to join team by a player, expiration time can be used by database
     * to eliminate old requests
     * @param teamId - id of team to join
     * @param playerId - id of player wanting to join team
     * @param expirationTime - expiration time of invite
     * @returns - true or false based on success or failure
     */
    async createJoinRequest(
        teamId: number,
        playerId: string,
        expirationTime: Date
    ): Promise<boolean> {
        logger.verbose("Entering method createJoinRequest()", {
            class: this.className,
            values: { teamId, playerId, expirationTime },
        });

        // todo: combine into one query
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

    /**
     * Deletes request to join team. This request is represented simply in database, so the
     * team id and player id or the only attributes needed to remove the request
     * @param playerId - id of player
     * @param teamId - id of team
     * @returns - true or false based on success or failure
     */
    async removeJoinRequest(playerId: string, teamId: number): Promise<boolean> {
        logger.verbose("Entering method deleteJoinRequest()", {
            class: this.className,
            values: { teamId, playerId },
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

    /**
     * Finds all players on team roster
     * @param teamId - team id to search with
     * @returns - List of PlayerSmall objects. Returns limited details on players
     */
    async findAllPlayersByTeamId(teamId: number): Promise<PlayerSmall[]> {
        logger.verbose("Entering method findAllPlayersByTeamId()", {
            class: this.className,
        });

        const sqlJoin =
            "SELECT team_roster.role, player.auth_id, player.first_name, player.last_name, player.gender, player.status, player.image FROM team_roster JOIN player ON team_roster.player_AUTH_ID = player.auth_ID WHERE team_roster.team_ID = $1";

        return withClient(async (querier) => {
            const players = (await querier(sqlJoin, [teamId])).rows;

            return players.map(
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
        });
    }
}

const test = new TeamDAO();
// test.findAllTeamsByPlayerId()
// test.findAllTeams();
// test.findTeamById(12)

// const team = new Team({
//     id: 20,
//     name: "Hello Barbie",
//     wins: 0,
//     ties: 0,
//     losses: 0,
//     image: "",
//     visibility: Visibility.OPEN,
//     sport: "Soccer",
//     dateCreated: null,
//     sportsmanshipScore: 4.0,
//     status: Status.ACTIVE,
//     maxTeamSize: 12,
//     players: [],
//     organizationId: "7f83b6f4-754a-4f34-913d-907c1226321f",
//     bracketId: null,
// });

testFunc();

async function testFunc() {
    // test.createJoinRequest(12, "player4");
    // await test.findTeamByIdWithPlayers(12);
    // console.log(await test.addToTeamRoster(12, "player4", Role.PLAYER))
    // console.log(await test.removeFromTeamRoster(12, "player2"));
    // const newTeam = await test.updateTeam(team);
    // const newTeam = await test.createTeam(team)
    // console.log(await test.findAllTeamsByPlayerId("auth0|62760b4733c477006f82c56d"));
    // console.log(newTeam?.getId());
    // console.log(await test.findTeamById(12));
}
