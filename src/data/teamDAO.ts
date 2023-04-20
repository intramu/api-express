import format from "pg-format";
import {
    IJoinRequest,
    IJoinRequestDatabase,
    convertFromDatabaseFormat,
} from "../interfaces/ITeamJoinRequest";
import { ITeamDatabase } from "../interfaces/ITeam";
import { PlayerSmall } from "../models/PlayerSmall";
import { Team } from "../models/Team";
import { Sport } from "../utilities/enums/commonEnum";
import { TeamGender, TeamRole, TeamStatus, TeamVisibility } from "../utilities/enums/teamEnum";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";
import { ContestGame } from "../models/competition/ContestGame";
import { IContestGameDatabase } from "../interfaces/IContestGame";
import { IPlayerTeamDatabase } from "../interfaces/IPlayer";

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
            const response = (await querier<ITeamDatabase>(sqlAll, [id])).rows;

            return response.map((team) => Team.fromDatabase({ ...team, players: [] }));
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

        // REVISIT: leave old method to test for performance against new method
        const sqlNew = `SELECT t.*
            FROM team t 
            JOIN team_roster tr ON tr.team_id = t.id
            WHERE tr.player_auth_id = $1`;

        const sqlFindPlayers = `SELECT tr.team_id, tr.role, p.auth_id, p.first_name, p.last_name, p.gender, p.status, p.image 
            FROM team_roster tr
            JOIN player p ON p.auth_id = tr.player_auth_ID
            WHERE tr.team_ID IN (%L)`;

        const sql = `SELECT t.id as team_id, t.*, p.auth_id, tr.role
            FROM team_roster tr
            JOIN team AS t ON t.id = tr.team_id
            JOIN player AS p ON p.auth_id = tr.player_auth_id
            WHERE tr.player_auth_id = $1 OR tr.team_id = t.id
            GROUP BY(p.auth_id, t.id, tr.role)`;
        // const sql = `SELECT t.*,
        //     json_agg(json_build_object('auth_id', p.auth_id, 'first_name', p.first_name, 'last_name', p.last_name, 'gender', p.gender, 'status', p.status, 'image', p.image, 'role', tr.role)) AS players
        //     FROM team t
        //     FULL OUTER JOIN team_roster AS tr ON t.id = tr.team_id
        //     RIGHT JOIN player AS p ON p.auth_id = tr.player_auth_id
        //     WHERE tr.player_auth_id = $1
        //     GROUP BY(t.id)`;

        const result = await withClientRollback(async (querier) => {
            // first a query to find teams is performed
            const teams = (await querier<ITeamDatabase>(sqlNew, [id])).rows;
            // const teamss = (await querier<ITeamDatabase>(sql, [id])).rows;

            const teamIdList = teams.map((x) => x.id);

            if (teams.length === 0) {
                return IsRollback;
            }

            // next using the team ids from above each player on the team is retrieved
            const players = (await querier(format(sqlFindPlayers, teamIdList))).rows;

            // return teams.map((team) =>
            //     Team.fromDatabase({
            //         ...team,
            //         players: team.players.map((player) => PlayerSmall.fromDatabase(player)),
            //     })
            // );

            return teams.map((team) => {
                const playerList = players
                    .filter((player) => player.team_id === team.id)
                    .map((player) =>
                        PlayerSmall.fromDatabase({
                            auth_id: player.auth_id,
                            role: player.role,
                            first_name: player.first_name,
                            last_name: player.last_name,
                            gender: player.gender,
                            status: player.status,
                            image: player.image,
                        })
                    );

                return Team.fromDatabase({ ...team, players: playerList });
            });
        });

        if (result === IsRollback) {
            return [];
        }

        return result;
    }

    /**
     * Finds all teams, ignores any status
     * @returns - list of teams
     */
    async findAllTeams(): Promise<Team[]> {
        logger.verbose("Entering method findAllTeams()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM team";

        return withClient(async (querier) => {
            const teams = (await querier<ITeamDatabase>(sqlAll)).rows;

            return teams.map((team) => Team.fromDatabase({ ...team, players: [] }));
        });
    }

    /**
     * Returns team details with player list
     * @param teamId - id to search for team with
     * @returns - team object with players or null
     */
    async findTeamById(teamId: number): Promise<Team | null> {
        logger.verbose("Entering method findTeamById()", {
            class: this.className,
        });

        // REVISIT: test performance of two queries to one query
        const sqlFind = "SELECT * FROM team WHERE id = $1";
        const sqlFindPlayers =
            "SELECT team_roster.role, player.auth_id, player.first_name, player.last_name, player.gender, player.status, player.image FROM team_roster JOIN player ON team_roster.player_AUTH_ID = player.auth_ID WHERE team_roster.team_ID = $1";

        const sql = `SELECT t.*,
            json_agg(json_build_object('auth_id', p.auth_id, 'first_name', p.first_name, 'last_name', p.last_name, 'gender', p.gender, 'status', p.status, 'image', p.image, 'role', tr.role)) AS players
            FROM team t
            JOIN team_roster AS tr ON t.id = tr.team_id
            JOIN player AS p ON p.auth_id = tr.player_auth_id
            WHERE t.id = $1
            GROUP BY(t.id)`;

        return withClient(async (querier) => {
            // first fetch team
            const [team] = (await querier<ITeamDatabase>(sql, [teamId])).rows;

            if (!team) {
                return null;
            }

            const playerList = team.players.map((player) => PlayerSmall.fromDatabase(player));

            return Team.fromDatabase({ ...team, players: playerList });
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

            return response.rowCount > 0;
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
                await querier<ITeamDatabase>(sqlPatch, [
                    name,
                    team.getWins(),
                    team.getTies(),
                    team.getLosses(),
                    image,
                    team.getVisibility(),
                    team.getSportsmanshipScore(),
                    team.getStatus(),
                    team.getMaxTeamSize(),
                    team.getBracketId(),
                ])
            ).rows;

            if (response === undefined) {
                return null;
            }

            return Team.fromDatabase({ ...response, players: [] });
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
     * Creates new team and adds player to roster using common table expression
     * will have to revisit performance versus two separate queries
     * @param team entity
     * @param playerId id of player entity
     * @param orgId id of organization
     * @param role role of player
     * @returns
     */
    async createTeam(team: Team, playerId: string, orgId: string, role: TeamRole): Promise<Team> {
        logger.verbose("Entering method createTeam()", {
            class: this.className,
            values: { team, playerId, orgId, role },
        });

        const sqlNew = `with new_team AS (
            INSERT INTO team (name, wins, ties, losses, image, visibility, gender, sportsmanship_score, status, max_team_size, bracket_id, organization_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
            ),
            new_role AS(
                INSERT INTO team_roster (player_auth_id, team_id, role) 
                VALUES($13, (SELECT id FROM new_team), $14)
            )
            SELECT * FROM new_team`;

        return withClient(async (querier) => {
            const [newTeam] = (
                await querier<ITeamDatabase>(sqlNew, [
                    team.getName(),
                    team.getWins(),
                    team.getTies(),
                    team.getLosses(),
                    team.getImage(),
                    team.getVisibility(),
                    team.getGender(),
                    team.getSportsmanshipScore(),
                    team.getStatus(),
                    team.getMaxTeamSize(),
                    team.getBracketId(),
                    orgId,
                    playerId,
                    role,
                ])
            ).rows;

            if (newTeam === undefined) {
                logger.error("Error creating team", {
                    class: this.className,
                });
                throw new Error("Error creating team");
            }

            return Team.fromDatabase({
                ...newTeam,
                players: [],
            });
        });
    }

    /**
     * Player is added to team roster with a role attached
     * @param teamId - team id to add player to
     * @param playerId - player to be added to team
     * @param role - role attached to player
     * @returns - true or false depending on success or failure
     */
    async addToTeamRoster(teamId: number, playerId: string, role: TeamRole): Promise<void> {
        logger.verbose("Entering method addToTeamRoster()", {
            class: this.className,
            values: { teamId, playerId },
        });

        const sqlAddPlayer =
            "INSERT INTO team_roster (player_AUTH_ID, team_ID, role) VALUES ($1, $2, $3)";

        return withClient(async (querier) => {
            const response = (await querier(sqlAddPlayer, [playerId, teamId, role])).rowCount;

            if (response < 0) {
                logger.error("Error adding player to roster", {
                    class: this.className,
                });
                throw new Error("Error adding player to roster");
            }
        });
    }

    /**
     * Player is removed from team roster
     * @param teamId - id of team
     * @param playerId - id of player to remove from team
     * @returns - true or false based on success or failure
     */
    async removeFromTeamRoster(teamId: number, playerId: string): Promise<void> {
        logger.verbose("Entering method removeFromTeamRoster()", {
            class: this.className,
            values: { teamId, playerId },
        });

        const sqlRemove = "DELETE FROM team_roster WHERE player_AUTH_ID=$1 AND team_ID=$2";

        return withClient(async (querier) => {
            const response = (await querier(sqlRemove, [playerId, teamId])).rowCount;

            if (response < 0) {
                logger.error("Error removing player from team", {
                    class: this.className,
                });
                throw new Error("Error removing player from team");
            }

            if (response > 1) {
                logger.error("removeFromTeamRoster deleted more than one record", {
                    class: this.className,
                    values: {
                        playerId,
                        teamId,
                    },
                });
            }
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
    ): Promise<IJoinRequest> {
        logger.verbose("Entering method createJoinRequest()", {
            class: this.className,
            values: { teamId, playerId, expirationTime },
        });

        // CTE first queries player table for player requesting to join team
        // Gets name passes that to second query
        // Gets name from player and concatenates the first and last name
        // Inserts that as the requesting_player_full_name
        const sqlNew = `with requesting_player AS (
            SELECT first_name, last_name FROM player WHERE auth_id = $1
            )
            INSERT INTO team_join_requests (player_auth_id, team_id, requesting_player_full_name, expiration_time) 
            VALUES ($1, $2, (SELECT CONCAT(first_name, last_name) FROM requesting_player), $3) RETURNING *`;

        return withClient(async (querier) => {
            const [response] = (
                await querier<IJoinRequest>(sqlNew, [playerId, teamId, expirationTime])
            ).rows;

            if (!response) {
                logger.error("Error creating request to join team", {
                    class: this.className,
                });
                throw new Error("Error creating request to join team");
            }

            return response;
        });
    }

    async findAllJoinRequests(teamId: number): Promise<IJoinRequest[]> {
        logger.verbose("Entering method findAllJoinRequests()", {
            class: this.className,
            values: { teamId },
        });

        const sql = "SELECT * FROM team_join_requests WHERE team_id = $1";

        return withClient(async (querier) => {
            const response = (await querier<IJoinRequestDatabase>(sql, [teamId])).rows;
            return response.map((request) => convertFromDatabaseFormat(request));
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

    async updateJoinRequest(
        playerId: string,
        teamId: number,
        expirationTime: Date
    ): Promise<IJoinRequest> {
        logger.verbose("Entering method updateJoinRequest", {
            class: this.className,
            values: { teamId, playerId },
        });

        const sqlNew = `with requesting_player AS (
            SELECT first_name, last_name FROM player WHERE auth_id = $1
            )
            UPDATE team_join_requests SET player_auth_id = $1, team_id = $2, requesting_player_full_name = (SELECT CONCAT(first_name, last_name) FROM requesting_player), expiration_time = $3 WHERE player_auth_id = $1 AND team_id = $2 RETURNING *`;
        const sql =
            "UPDATE team_join_requests SET player FROM team_join_requests WHERE team_id = $1";

        return withClient(async (querier) => {
            const [response] = (
                await querier<IJoinRequest>(sqlNew, [playerId, teamId, expirationTime])
            ).rows;

            return response;
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

        const sqlJoin = `SELECT tr.role, p.auth_id, p.first_name, p.last_name, p.gender, p.status, p.image 
            FROM team_roster tr 
            JOIN player p ON tr.player_AUTH_ID = p.auth_ID 
            WHERE tr.team_ID = $1`;

        return withClient(async (querier) => {
            const players = (await querier<IPlayerTeamDatabase>(sqlJoin, [teamId])).rows;

            return players.map((player) => PlayerSmall.fromDatabase(player));
        });
    }

    async findAllContestGames(teamId: number): Promise<ContestGame[]> {
        logger.verbose("Entering method findAllContestGames()", {
            class: this.className,
            values: { teamId },
        });

        /**
         * Selects all games where the away/home team id equals the one passed in
         * It then joins the team table and location table where this result exists
         * These table joins are converted into json
         */
        const sql = `SELECT g.id AS contest_game_id, g.*, 
        row_to_json (h) AS home_team,
        row_to_json (a) AS away_team,
        row_to_json (l) AS location
        FROM contest_game g
        INNER JOIN team AS h ON g.home_team_id = h.id
        INNER JOIN team AS a ON g.away_team_id = a.id
        INNER JOIN location AS l ON l.id = g.location_id
        WHERE home_team_id = $1 OR away_team_id = $1
        GROUP BY g.id, g.date_created, g.game_date, g.score_home, g.score_away, g.status_home, g.status_away, g.location_id, g.home_team_id, g.away_team_id, g.bracket_id, h.*, a.*, l.*`;

        return withClient(async (querier) => {
            const response = (await querier<IContestGameDatabase>(sql, [teamId])).rows;

            // const test = response.map((game) =>
            //     ContestGame.fromDatabase({
            //         id: game.id,
            //         date_created: game.date_created,
            //         game_date: game.game_date,
            //         notes: game.notes,
            //         score_away: game.score_away,
            //         score_home: game.score_home,
            //         status_away: game.status_away,
            //         status_home: game.status_home,
            //         home_team: game.home_team,
            //         away_team: game.away_team,
            //         location: game.location,
            //     })
            // );
            return response.map((game) => ContestGame.fromDatabase(game));
        });
    }
}

const test = new TeamDAO();
// test.findAllTeamsByPlayerId()
// test.findAllTeams();
// test.findTeamById(12)

const team = new Team({
    name: "Hello Barbie",
    wins: 0,
    ties: 0,
    losses: 0,
    image: "",
    visibility: TeamVisibility.PRIVATE,
    sport: Sport.BASKETBALL,
    sportsmanshipScore: 4.0,
    status: TeamStatus.ELIGIBLE,
    maxTeamSize: 12,
    players: [],
    organizationId: "dab32727-cb7c-4320-8865-6f1b842785ed",
});

testFunc();

async function testFunc() {
    // console.log(await test.findAllTeamsByPlayerId("auth0|62760b4733c477006f82c56d"));
    // console.log(await test.findAllTeamsByPlayerId("auth0|643f2fc44116bcb4fcff7486"));
    // test.createJoinRequest(12, "player4");
    // await test.findTeamByIdWithPlayers(12);
    // console.log(await test.addToTeamRoster(12, "player4", Role.PLAYER))
    // console.log(await test.removeFromTeamRoster(12, "player2"));
    // const newTeam = await test.updateTeam(team);
    // console.log(
    //     await test.createTeam(
    //         team,
    //         "auth0|62760b4733c477006f82c56c",
    //         "dab32727-cb7c-4320-8865-6f1b842785ed"
    //     )
    // );
    // console.log(await test.findAllTeamsByPlayerId("auth0|62760b4733c477006f82c56d"));
    // console.log(await test.findAllTeamsByPlayerId("auth0|62760b4733c477006f82c56d"));
    // console.log(await test.findAllJoinRequests(18));
    // console.log(await test.createJoinRequest(22, "auth0|643f2fc44116bcb4fcff7486", new Date()));
    // console.log(await test.updateJoinRequest("auth0|643f2fc44116bcb4fcff7486", 22, new Date()));
    // console.log(newTeam?.getId());
    // console.log(await test.findTeamById(18));
    // console.log(await test.findAllContestGames(18));
}
