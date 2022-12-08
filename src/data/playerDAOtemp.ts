// import mysql from "mysql";
// import mysql2 from "mysql2/promise";
import "dotenv/config";
// import { promisify } from "util";
import logger from "../utilities/winstonConfig";
import { Player } from "../models/Player";
import { Team } from "../models/Team";

// const pool = mysql.createPool({
//     connectionLimit: 10,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// const river = mysql2.createPool({
//     connectionLimit: 10,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// const lake = mysql2.createPool({
//     connectionLimit: 10,
//     host: "intramu-database.cdb5yw2ercby.us-east-1.rds.amazonaws.com",
//     user: "sudo",
//     password: "00a4b5f200a6779b27586fbc95",
//     database: "intramu_main",
// });

// ! REVISIT - mysql import doesn't event exist any more so these need to be fixed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pool: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const river: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lake: any = null;

export default class PlayerDAO {
    className = this.constructor.name;

    /**
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createSecondaryPlayer(player: Player | any, callback: any) {
        logger.verbose("Entering method createSecondaryPlayer", {
            class: this.className,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pool.getConnection(async (err: any, conn: any) => {
            try {
                if (err) throw err;

                const sql =
                    "INSERT INTO player (AUTH_ID, FIRST_NAME, LAST_NAME, GENDER) VALUES (?,?,?,?)";

                // console.log("bruh");

                // ! REVISIT - do no do this that is just a recipe for disaster
                // conn.query = promisify(conn.query);
                // ! REVISIT - these player props should not exist
                const result = await conn.query(sql, [
                    player.$authId,
                    player.$firstName,
                    player.$lastName,
                    1,
                ]);

                callback(result);
                return;
            } catch (error) {
                if (error instanceof Error)
                    logger.error("Database Connection / Query Error", {
                        type: error.message,
                        class: this.className,
                    });
                callback(null);
            }
        });
    }

    /** Methods to be written */
    // showTeam() -- show only one team based on passed id or name?

    /**
     * Will fetch all the teams that are currently on the network and return them to user. No protection or further authentication needed to see all teams
     *
     * @param callback Passes back the result with all of the teams on network
     */
    async showAllTeams() {
        logger.verbose("Entering method showAllTeams()", {
            class: this.className,
        });

        const sql =
            "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.SPORT, team.DATE_CREATED, team.CURRENT_TEAM_SIZE, team.MAX_TEAM_SIZE, tr.ROLE, player.AUTH_ID, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on (team.ID = tr.team_ID) JOIN player player on (tr.player_AUTH_ID = player.AUTH_ID) ORDER BY team.ID ASC";
        let conn = null;

        try {
            conn = await river.getConnection();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [result, fields] = await conn.query(sql);
            return result;
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            // if (error instanceof Error)
            //     logger.error("Database Connection / Query Error", {
            //         type: error,
            //         class: this.className,
            //     });
            return null;
        } finally {
            if (conn) conn.release();
        }
        // catch (error) {
        //     if (error instanceof Error)
        //         logger.error("Database Connection / Query Error", {
        //             type: error,
        //             class: this.className,
        //         });
        //     return callback(null);
        // }
    }

    /**
     * This method shows all the teams that a player is on. This will show multiple teams, but not all teams in network.
     *
     * @param playerId Uses player id to search the teams that they are on
     * @param callback Passes back result with lists of team info
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async showAllPlayersTeams(playerId: string, callback: any) {
        logger.verbose("Entering method showAllPlayersTeams()", {
            class: this.className,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pool.getConnection(async (err: any, conn: any) => {
            try {
                if (err) throw err;

                const sql =
                    "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.SPORT, team.DATE_CREATED, team.CURRENT_TEAM_SIZE, team.MAX_TEAM_SIZE, tr.ROLE, tr.player_AUTH_ID, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on(team.ID = tr.team_ID) JOIN player player on(tr.player_AUTH_ID = player.AUTH_ID) WHERE tr.team_ID IN (SELECT team_ID FROM team_roster WHERE player_AUTH_ID = ?) ORDER BY tr.team_ID ASC";

                // ! REVISIT - do no do this that is just a recipe for disaster
                // conn.query = promisify(conn.query);
                const result = await conn.query(sql, [playerId]);
                conn.release();

                return callback(result);
            } catch (error) {
                if (error instanceof Error)
                    logger.error("Database Connection / Query Error", {
                        type: error.message,
                        class: this.className,
                    });
                return callback(null);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getConnectionFromPool(callback: any) {
        logger.verbose("Entering method getConnectionFromPool", {
            class: this.className,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pool.getConnection(async (err: any, conn: any) => {
            try {
                if (err) throw err;

                return callback(conn);
            } catch (error) {
                if (error instanceof Error)
                    logger.error("Database Connection Error", {
                        type: error,
                        class: this.className,
                    });

                return callback(null);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createTeam(team: Team | any, callback: any) {
        logger.verbose("Entering method createTeam()", {
            class: this.className,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pool.getConnection(async (err: any, conn: any) => {
            try {
                const sqlTeamInsert =
                    "INSERT INTO team (ID, NAME, IMAGE, VISIBILITY, SPORT) values (?,?,?,?,?)";

                // ! REVISIT - do no do this that is just a recipe for disaster
                // conn.query = promisify(conn.query);
                // ! REVISIT - these might not exist as properties
                const result = await conn.query(sqlTeamInsert, [
                    team.$id,
                    team.$name,
                    team.$image,
                    team.$visibility,
                    team.$sport,
                ]);

                conn.release();
                return callback(result);
            } catch (error) {
                if (error instanceof Error)
                    logger.error("Database Connection / Query Error", {
                        type: error,
                        class: this.className,
                    });

                return callback(null);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async findTeamVisibility(teamId: number, callback: any) {
        logger.verbose("Entering method findTeamVisibility()", {
            class: this.className,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pool.getConnection(async (err: any, conn: any) => {
            try {
                const sql =
                    "SELECT ID, VISIBILITY, CURRENT_TEAM_SIZE, MAX_TEAM_SIZE FROM team WHERE ID = ?";

                // ! REVISIT - do no do this that is just a recipe for disaster
                // conn.query = promisify(conn.query);
                const authResult = await conn.query(sql, [teamId]);

                conn.release();
                return callback(authResult);
            } catch (error) {
                if (error instanceof Error)
                    logger.error("Database Connection / Query Error", {
                        type: error,
                        class: this.className,
                    }); //

                return callback(null);
            }
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async joinTeam(playerId: string, teamId: number, role: string, callback: any) {
        logger.verbose("Entering method joinTeam()", {
            class: this.className,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
        pool.getConnection(async (err: any, conn: any) => {
            try {
                if (err) throw err;

                const addPlayerSql =
                    "INSERT INTO team_roster (player_AUTH_ID, team_ID, ROLE) VALUES (?,?,?)";

                // const addTeamSizeSql =
                //     "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE + 1 WHERE ID = ?";

                // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
                conn.beginTransaction(async (err2: any) => {
                    try {
                        if (err2) throw err2;

                        // ! REVISIT - do no do this that is just a recipe for disaster
                        // conn.query = promisify(conn.query);
                        const addPlayerResult = await conn.query(addPlayerSql, [
                            playerId,
                            teamId,
                            role,
                        ]);

                        // const addTeamSizeResult = await conn.query(addTeamSizeSql, [teamId]);

                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        conn.commit((err3: any) => {
                            if (err3) throw err3;

                            return callback(addPlayerResult);
                        });
                    } catch (error) {
                        if (error instanceof Error)
                            logger.error("Database Connection / Query Error", {
                                type: error,
                                class: this.className,
                            });
                        conn.rollback();
                        return callback(null);
                    }
                });
            } catch (error) {
                if (error instanceof Error)
                    logger.error("Database Connection / Query Error", {
                        type: error,
                        class: this.className,
                    });
                conn.rollback();
                return callback(null);
            }
        });
    }

    async removePlayerFromTeam(playerId: string, teamId: number) {
        logger.verbose("Entering method removeFromTeam()", {
            class: this.className,
        });
        let conn = null;
        const deleteFromTeamSql =
            "DELETE FROM team_roster WHERE player_AUTH_ID = ? AND team_ID = ?";

        const updateTeamSizeSql =
            "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE - 1 WHERE ID = ?";

        try {
            conn = await river.getConnection();
            await conn.query(deleteFromTeamSql, [playerId, teamId]);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [updateResult, fields] = await conn.query(updateTeamSizeSql, [teamId]);
            await conn.commit();
            return updateResult;
        } catch (error) {
            if (conn) await conn.rollback();
            logger.crit("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            if (conn) conn.release();
        }
    }

    // eslint-disable-next-line class-methods-use-this
    async testConnToCloud() {
        let conn = null;
        try {
            conn = await lake.getConnection();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [result, fields] = await conn.query("SELECT * FROM player");
            console.log(result);

            // conn.ping();
            // console.log("server responded");
            // console.log(fields);
        } catch (error) {
            console.log(error);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async test(playerId: string, teamId: number) {
        let conn = null;
        // const deleteFromTeamSql =
        //     "DELETE FROM team_roster WHERE player_AUTH_ID = ? AND team_ID = ?";

        // const updateTeamSizeSql =
        //     "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE - 1 WHERE ID = ?";

        const tesSql = "SELECT * FROM team";
        try {
            conn = await river.getConnection();
            await conn.beginTransaction();
            // await conn.query(deleteFromTeamSql, [playerId, teamId]);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [result, fields] = await conn.query(tesSql);
            await conn.commit();
            // console.log(result);
            return result;
        } catch (error) {
            if (conn) await conn.rollback();

            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            if (conn) conn.release();
        }
    }
}

// const playerdao = new PlayerDAO();

// const dummyPlayer = Player.SecondaryPlayer(
//     1231325431,
//     "Noah",
//     "Roerig",
//     "ENGLISH",
//     "USER",
//     "MALE",
//     new Date(),
//     "PRIVATE",
//     "1,2023",
//     "NULL",
//     "VALID"
// );

// playerdao.test("fdsa", 5);
