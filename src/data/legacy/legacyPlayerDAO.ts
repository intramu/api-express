// import mysql from "mysql";
// import mysql2 from "mysql2/promise";
// import "dotenv/config";
// import { promisify } from "util";
// import logger from "../../utilities/winstonConfig";
// import { Player } from "../../models/Player";
// import { Team } from "../../models/Team";

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

// export default class PlayerDAO {
//     className = this.constructor.name;

//     /**
//      *
//      */
//     async createSecondaryPlayer(player: Player, callback: any) {
//         logger.verbose("Entering method createSecondaryPlayer", {
//             class: this.className,
//         });
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;

//                 let sql =
//                     "INSERT INTO player (AUTH_ID, FIRST_NAME, LAST_NAME, GENDER) VALUES (?,?,?,?)";

//                 // console.log("bruh");

//                 conn.query = promisify(conn.query);
//                 let result = await conn.query(sql, [
//                     player.$authId,
//                     player.$firstName,
//                     player.$lastName,
//                     1,
//                 ]);

//                 callback(result);
//                 return;
//             } catch (error) {
//                 if (error instanceof Error)
//                     logger.error("Database Connection / Query Error", {
//                         type: error.message,
//                         class: this.className,
//                     });
//                 callback(null);
//                 return;
//             }
//         });
//     }

//     /** Methods to be written */
//     //showTeam() -- show only one team based on passed id or name?

//     /**
//      * Will fetch all the teams that are currently on the network and return them to user. No protection or further authentication needed to see all teams
//      *
//      * @param callback Passes back the result with all of the teams on network
//      */
//     async showAllTeams(callback: any) {
//         logger.verbose("Entering method showAllTeams()", {
//             class: this.className,
//         });

//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;

//                 let sql =
//                     "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.DATE_CREATED, team.CURRENT_TEAM_SIZE, team.MAX_TEAM_SIZE, tr.ROLE, player.AUTH_ID, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on (team.ID = tr.team_ID) JOIN player player on (tr.player_AUTH_ID = player.AUTH_ID) ORDER BY team.ID ASC";

//                 conn.query = promisify(conn.query);
//                 let result = await conn.query(sql);

//                 return callback(result);
//             } catch (error) {
//                 if (error instanceof Error)
//                     logger.error("Database Connection / Query Error", {
//                         type: error,
//                         class: this.className,
//                     });
//                 return callback(null);
//             }
//         });
//     }

//     /**
//      * This method shows all the teams that a player is on. This will show multiple teams, but not all teams in network.
//      *
//      * @param playerId Uses player id to search the teams that they are on
//      * @param callback Passes back result with lists of team info
//      */
//     async showAllPlayersTeams(playerId: string, callback: any) {
//         logger.verbose("Entering method showAllPlayersTeams()", {
//             class: this.className,
//         });

//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;

//                 let sql =
//                     "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.DATE_CREATED, team.CURRENT_TEAM_SIZE, team.MAX_TEAM_SIZE, tr.ROLE, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on(team.ID = tr.team_ID) JOIN player player on(tr.player_AUTH_ID = player.AUTH_ID) WHERE tr.team_ID IN (SELECT team_ID FROM team_roster WHERE player_AUTH_ID = ?) ORDER BY tr.team_ID ASC";

//                 conn.query = promisify(conn.query);
//                 let result = await conn.query(sql, [playerId]);

//                 return callback(result);
//             } catch (error) {
//                 if (error instanceof Error)
//                     logger.error("Database Connection / Query Error", {
//                         type: error.message,
//                         class: this.className,
//                     });
//                 return callback(null);
//             }
//         });
//     }

//     public getConnectionFromPool(callback: any) {
//         logger.verbose("Entering method getConnectionFromPool", {
//             class: this.className,
//         });
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;

//                 return callback(conn);
//             } catch (error) {
//                 if (error instanceof Error)
//                     logger.error("Database Connection Error", {
//                         type: error,
//                         class: this.className,
//                     });

//                 return callback(null);
//             }
//         });
//     }

//     async createTeam(team: Team, callback: any) {
//         logger.verbose("Entering method createTeam()", {
//             class: this.className,
//         });

//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 let sqlTeamInsert =
//                     "INSERT INTO team (ID, NAME, IMAGE, VISIBILITY) values (?,?,?,?)";

//                 conn.query = promisify(conn.query);
//                 let result = await conn.query(sqlTeamInsert, [
//                     team.$id,
//                     team.$name,
//                     team.$image,
//                     team.$visibility,
//                 ]);

//                 conn.release();
//                 return callback(result);
//             } catch (error) {
//                 if (error instanceof Error)
//                     logger.error("Database Connection / Query Error", {
//                         type: error,
//                         class: this.className,
//                     });

//                 return callback(null);
//             }
//         });
//     }

//     async findTeamVisibility(teamId: number, callback: any) {
//         logger.verbose("Entering method findTeamVisibility()", {
//             class: this.className,
//         });

//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 let sql =
//                     "SELECT ID, VISIBILITY, CURRENT_TEAM_SIZE, MAX_TEAM_SIZE FROM team WHERE ID = ?";

//                 conn.query = promisify(conn.query);
//                 let authResult = await conn.query(sql, [teamId]);

//                 conn.release();
//                 return callback(authResult);
//             } catch (error) {
//                 if (error instanceof Error)
//                     logger.error("Database Connection / Query Error", {
//                         type: error,
//                         class: this.className,
//                     });

//                 return callback(null);
//             }
//         });
//     }

//     async joinTeam(
//         playerId: string,
//         teamId: number,
//         role: string,
//         callback: any
//     ) {
//         logger.verbose("Entering method joinTeam()", {
//             class: this.className,
//         });

//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;

//                 let addPlayerSql =
//                     "INSERT INTO team_roster (player_AUTH_ID, team_ID, ROLE) VALUES (?,?,?)";

//                 let addTeamSizeSql =
//                     "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE + 1 WHERE ID = ?";

//                 conn.beginTransaction(async (err: any) => {
//                     try {
//                         if (err) throw err;

//                         conn.query = promisify(conn.query);
//                         let addPlayerResult = await conn.query(addPlayerSql, [
//                             playerId,
//                             teamId,
//                             role,
//                         ]);

//                         let addTeamSizeResult = await conn.query(
//                             addTeamSizeSql,
//                             [teamId]
//                         );

//                         conn.commit((err: any) => {
//                             if (err) throw err;

//                             return callback(addPlayerResult);
//                         });
//                     } catch (error) {
//                         if (error instanceof Error)
//                             logger.error("Database Connection / Query Error", {
//                                 type: error,
//                                 class: this.className,
//                             });
//                         conn.rollback();
//                         return callback(null);
//                     }
//                 });
//             } catch (error) {
//                 if (error instanceof Error)
//                     logger.error("Database Connection / Query Error", {
//                         type: error,
//                         class: this.className,
//                     });
//                 conn.rollback();
//                 return callback(null);
//             }
//         });
//     }

//     public removePlayerFromTeam(
//         playerId: string,
//         teamId: number,
//         callback: any
//     ) {
//         logger.verbose("Entering method removeFromTeam()", {
//             class: this.className,
//         });

//         let deleteFromTeamSql =
//             "DELETE FROM team_roster WHERE player_AUTH_ID = ? AND team_ID = ?";

//         let updateTeamSizeSql =
//             "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE - 1 WHERE ID = ?";

//         // try {
//         //     conn.query = promisify(conn.query);
//         //     let deleteResult = await conn.query(deleteFromTeamSql, [
//         //         playerId,
//         //         teamId,
//         //     ]);

//         //     let updateResult = await conn.query(updateTeamSizeSql, [teamId]);
//         // } catch (error) {}
//     }

//     public async testConnToCloud() {
//         let conn = null;
//         try {
//             conn = await lake.getConnection();
//             const [result, fields] = await conn.query("SELECT * FROM player");
//             console.log(result);

//             // conn.ping();
//             // console.log("server responded");
//             // console.log(fields);
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     async test(playerId: string, teamId: number) {
//         let conn = null;
//         let deleteFromTeamSql =
//             "DELETE FROM team_roster WHERE player_AUTH_ID = ? AND team_ID = ?";

//         let updateTeamSizeSql =
//             "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE - 1 WHERE ID = ?";

//         let tesSql = "SELECT * FROM team";
//         try {
//             conn = await river.getConnection();
//             await conn.beginTransaction();
//             // await conn.query(deleteFromTeamSql, [playerId, teamId]);
//             let [result, fields] = await conn.query(tesSql);
//             await conn.commit();
//             // console.log(result);
//             return result;
//         } catch (error) {
//             if (conn) await conn.rollback();
//             console.log("wow");

//             throw error;
//         } finally {
//             if (conn) conn.release();
//         }
//     }
// }

// let playerdao = new PlayerDAO();

// let dummyPlayer = Player.SecondaryPlayer(
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
