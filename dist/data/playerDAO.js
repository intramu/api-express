"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
require("dotenv/config");
const util_1 = require("util");
const winstonConfig_1 = __importDefault(require("../utilities/winstonConfig"));
const Player_1 = require("../models/Player");
const pool = mysql_1.default.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
class PlayerDAO {
    constructor() {
        this.className = this.constructor.name;
    }
    /**
     *
     */
    createSecondaryPlayer(player, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method createSecondaryPlayer", {
                class: this.className,
            });
            pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err)
                        throw err;
                    let sql = "INSERT INTO player (AUTH_ID, FIRST_NAME, LAST_NAME, GENDER) VALUES (?,?,?,?)";
                    // console.log("bruh");
                    conn.query = (0, util_1.promisify)(conn.query);
                    let result = yield conn.query(sql, [
                        player.$authId,
                        player.$firstName,
                        player.$lastName,
                        1,
                    ]);
                    callback(result);
                    return;
                }
                catch (error) {
                    if (error instanceof Error)
                        winstonConfig_1.default.error("Database Connection / Query Error", {
                            type: error.message,
                            class: this.className,
                        });
                    callback(null);
                    return;
                }
            }));
        });
    }
    /** Methods to be written */
    //showTeam() -- show only one team based on passed id or name?
    /**
     * Will fetch all the teams that are currently on the network and return them to user. No protection or further authentication needed to see all teams
     *
     * @param callback Passes back the result with all of the teams on network
     */
    showAllTeams(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method showAllTeams()", {
                class: this.className,
            });
            pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err)
                        throw err;
                    let sql = "SELECT * FROM team";
                    conn.query = (0, util_1.promisify)(conn.query);
                    let result = yield conn.query(sql);
                    return callback(result);
                }
                catch (error) {
                    if (error instanceof Error)
                        winstonConfig_1.default.error("Database Connection / Query Error", {
                            type: error,
                            class: this.className,
                        });
                    return callback(null);
                }
            }));
        });
    }
    /**
     * This method shows all the teams that a player is on. This will show multiple teams, but not all teams in network.
     *
     * @param id Uses player id to search the teams that they are on
     * @param callback Passes back result with list of team info
     */
    showAllPlayersTeams(id, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method showAllPlayersTeams()", {
                class: this.className,
            });
            pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err)
                        throw err;
                    let sql = "SELECT team.ID, team.NAME, team.WINS, team.LOSSES FROM team_roster JOIN team on team_roster.team_ID=team.ID WHERE team_roster.player_AUTH_ID=?";
                    conn.query = (0, util_1.promisify)(conn.query);
                    let result = yield conn.query(sql, [id]);
                    callback(result);
                    return;
                }
                catch (error) {
                    if (error instanceof Error)
                        winstonConfig_1.default.error("Database Connection / Query Error", {
                            type: error.message,
                            class: this.className,
                        });
                    callback(null);
                    return;
                }
            }));
        });
    }
    getConnectionFromPool(callback) {
        winstonConfig_1.default.verbose("Entering method getConnectionFromPool", {
            class: this.className,
        });
        pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err)
                    throw err;
                return callback(conn);
            }
            catch (error) {
                if (error instanceof Error)
                    winstonConfig_1.default.error("Database Connection Error", {
                        type: error,
                        class: this.className,
                    });
                return callback(null);
            }
        }));
    }
    findTeamVisibility(teamId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method findTeamVisibility()", {
                class: this.className,
            });
            pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let sql = "SELECT ID, VISIBILITY, CURRENT_TEAM_SIZE, MAX_TEAM_SIZE FROM team WHERE ID = ?";
                    conn.query = (0, util_1.promisify)(conn.query);
                    let authResult = yield conn.query(sql, [teamId]);
                    conn.release();
                    return callback(authResult);
                }
                catch (error) {
                    if (error instanceof Error)
                        winstonConfig_1.default.error("Database Connection / Query Error", {
                            type: error,
                            class: this.className,
                        });
                    return callback(null);
                }
            }));
        });
    }
    joinTeam(playerId, teamId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method joinOpenTeam()", {
                class: this.className,
            });
            pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err)
                        throw err;
                    let addPlayerSql = "INSERT INTO team_roster (player_AUTH_ID, team_ID) VALUES (?,?)";
                    let addTeamSizeSql = "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE + 1 WHERE ID = ?";
                    conn.beginTransaction((err) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            if (err)
                                throw err;
                            conn.query = (0, util_1.promisify)(conn.query);
                            console.log("josh");
                            let addPlayerResult = yield conn.query(addPlayerSql, [
                                playerId,
                                teamId,
                            ]);
                            console.log("pig");
                            let addTeamSizeResult = yield conn.query(addTeamSizeSql, [teamId]);
                            console.log("burh");
                            conn.commit((err) => {
                                if (err) {
                                    conn.rollback();
                                    console.log("there");
                                    throw err;
                                }
                            });
                        }
                        catch (error) {
                            console.log("here");
                            throw error;
                        }
                    }));
                }
                catch (error) {
                    console.log("what about");
                    if (error instanceof Error)
                        winstonConfig_1.default.error("Database Connection / Query Error", {
                            type: error,
                            class: this.className,
                        });
                    conn.rollback();
                    return callback(null);
                }
            }));
        });
    }
}
exports.default = PlayerDAO;
// pool.getConnection(async (err: any, conn: any) => {
//     try {
//         if (err) throw err;
//         console.log("Start Connection Id", conn.threadId);
//         let sqlAuth =
//             "SELECT ID, VISIBILITY, CURRENT_TEAM_SIZE, MAX_TEAM_SIZE FROM team WHERE ID = ?";
//         let sqlRun =
//             "INSERT INTO team_roster (player_AUTH_ID, team_ID) VALUES (?,?)";
//         conn.query = promisify(conn.query);
//         let authResult = await conn.query(sqlAuth, [id]);
//         if (authResult.VISIBILITY === "PRIVATE") {
//             console.log("DENIED REQUEST, TEAM IS PRIVATE");
//             return;
//         }
//         let runResult = await conn.query(sqlRun, ["auth0|1234", 2]);
//         console.log(runResult);
//         console.log("End Connection Id", conn.threadId);
//         callback(runResult);
//         return;
//     } catch (error) {
//         if (error instanceof Error)
//             logger.error("Database Connection / Query Error", {
//                 type: error,
//                 class: this.className,
//             });
//         callback(null);
//         return;
//     }
// });
let playerdao = new PlayerDAO();
let dummyPlayer = Player_1.Player.SecondaryPlayer(1231325431, "Noah", "Roerig", "ENGLISH", "USER", "MALE", new Date(), "PRIVATE", "1,2023", "NULL", "VALID");
playerdao.joinTeam("auth|786905", 3, (result) => {
    console.log(result);
});
// playerdao.showAllPlayersTeams(
//     "auth0|62756151cfc4810067c25882",
//     (result: any) => {
//         if (result.length === 0) console.log("empty");
//         console.log(result);
//     }
// );
// const test = async () => {
//     try {
//         playerdao.createSecondaryPlayer(dummyPlayer, (callback: any) => {
//             console.log(callback);
//         });
//         // console.log(result);
//     } catch (error) {
//         console.log(error);
//     }
// };
// test();
// playerdao.createSecondaryPlayer().then((result) => {
//     console.log(result);
// });
// const pool = mysql2.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });
// export default class playerDAO {
//     public createPrimary(player: Player, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(err);
//                 callback(null);
//                 return;
//             }
//             let sql =
//                 "INSERT INTO player (DATE, FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PASSWORD, ROLE) VALUES (?,?,?,?,?,?)";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [
//                     new Date(),
//                     player.$firstName,
//                     player.$lastName,
//                     player.$emailAddress,
//                     player.$password,
//                     player.$role,
//                 ]);
//                 callback(result.insertId);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//         });
//     }
//     public createSecondary(player: Player, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(err);
//                 callback(null);
//                 return;
//             }
//             let sql =
//                 "UPDATE player SET GENDER=?, DOB=?, LANGUAGE=?, PROFILE_VISIBILITY=?, GRADUATION_DATE=?, YEAR=?,PROFILE_PICTURE=?, STATUS=? INTO player (DATE, FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PASSWORD, ROLE, university_ID) VALUES (?,?,?,?,?)";
//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [
//                     // admin.$firstName,
//                     // admin.$lastName,
//                     // admin.$emailAddress,
//                     // admin.$password,
//                     // 1,
//                 ]);
//                 callback(result.insertId);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//         });
//     }
// }
