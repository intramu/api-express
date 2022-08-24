"use strict";
// import mysql2 from "mysql2";
// import * as util from "util";
// // import { Administrator } from "../models/Administrator";
// // import { Organization } from "../models/Organization";
// const pool = mysql2.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });
// export default class adminDAO {
//     public testCall(callback: any) {
//         console.log("test");
//         callback("Hello Noah");
//     }
//     public databaseTestCall(callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(err);
//                 callback(null);
//                 return;
//             }
//             let sql = "SELECT * FROM player";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var [result] = await conn.query(sql);
//                 console.log(result);
//                 callback(result);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//         });
//     }
//     public login(emailAddress: string, password: string, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//             let sql =
//                 "SELECT ID, FIRST_NAME FROM player WHERE EMAIL_ADDRESS = ? AND PASSWORD = ?";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var [result] = await conn.query(sql, [emailAddress, password]);
//                 // console.log(result);
//                 if (result === undefined) callback(undefined);
//                 else callback(result);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//             }
//         });
//     }
//     public createOrganization(organization: Organization, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//             let sql =
//                 "INSERT INTO organization (ID, NAME, LOGO, PRIMARY_COLOR, ACCENT_COLOR, STATUS) VALUES(?,?,?,?,?,?)";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [
//                     organization.$id,
//                     organization.$name,
//                     organization.$logo,
//                     organization.$primaryColor,
//                     organization.$accentColor,
//                     organization.$status,
//                 ]);
//                 callback(result.affectedRows);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//             }
//         });
//     }
//     public createAdmin(admin: Administrator, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(err);
//                 callback(null);
//                 return;
//             }
//             let sql =
//                 "INSERT INTO administrator (FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PASSWORD, university_ID) VALUES (?,?,?,?,?)";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [
//                     admin.$firstName,
//                     admin.$lastName,
//                     admin.$emailAddress,
//                     admin.$password,
//                     1,
//                 ]);
//                 callback(result.insertId);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//         });
//     }
//     public findAdmin(id: number, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(err);
//                 callback(null);
//                 return;
//             }
//             let sql = "SELECT * FROM administrator WHERE ID = ?";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [1]);
//                 // console.log(result);
//                 callback(result[0]);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//         });
//     }
//     public findAllTeams(callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (err) {
//                 console.log(err);
//                 callback(null);
//                 return;
//             }
//             let sql =
//                 "SELECT t.ID as team_ID, t.NAME, t.SPORT, t.WINS, t.TIES, t.LOSSES, pt.player_ID, p.FIRST_NAME FROM team t LEFT JOIN team_has_player pt on (t.ID = pt.team_ID) LEFT JOIN player p on (pt.player_ID = p.ID)";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql);
//                 // console.log(result);
//                 if (result[0] == null) callback(undefined);
//                 else callback(result);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//             }
//         });
//     }
//     public findTeamById(id: number, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//             let sql =
//                 "SELECT team.ID as team_ID, team.NAME, team.SPORT, team.WINS, team.TIES, team.LOSSES, pt.player_ID, player.FIRST_NAME, player.GENDER, player.ROLE FROM team team JOIN team_has_player pt on (team.ID = pt.team_ID) JOIN player player on (pt.player_ID = player.ID) WHERE team.ID = ?";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [id]);
//                 if (result[0] == null) callback(undefined);
//                 else callback(result);
//             } catch (error) {}
//         });
//     }
//     public createTeam(name: string, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//             let sql = "INSERT INTO team (NAME, bracket_ID) VALUES(?,?)";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [name, 1]);
//                 callback(result.insertId);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//             }
//         });
//     }
//     public joinTeam(playerId: number, teamID: number, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//             let sql =
//                 "INSERT INTO team_has_player (team_ID, player_ID) VALUES (?,?)";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [teamID, playerId]);
//                 callback(result.affectedRows);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//             }
//         });
//     }
//     public findTeamRestrictions(teamId: number, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//             let sql =
//                 "SELECT AUTO_ACCEPT_MEMBERS, OPEN_TO_PLAYERS FROM team WHERE ID = ?";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var [result] = await conn.query(sql, [teamId]);
//                 // console.log(result);
//                 if (result === undefined) callback(undefined);
//                 else callback(result);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//             }
//         });
//     }
//     // pool.getConnection(async (err: any, conn: any) => {
//     //     try {
//     //         if (err) throw err;
//     //     } catch (error) {
//     //         console.log(error);
//     //         callback(null);
//     //         return;
//     //     }
//     //     let sql = "";
//     //     try {
//     //         conn.query = util.promisify(conn.query);
//     //         var result = await conn.query(sql, []);
//     //         callback();
//     //     } catch (error) {
//     //         console.log(error);
//     //         callback(null);
//     //     }
//     // });
// }
