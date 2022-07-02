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
const promise_1 = __importDefault(require("mysql2/promise"));
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
const river = promise_1.default.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
const lake = promise_1.default.createPool({
    connectionLimit: 10,
    host: "intramu-database.cdb5yw2ercby.us-east-1.rds.amazonaws.com",
    user: "sudo",
    password: "00a4b5f200a6779b27586fbc95",
    database: "intramu_main",
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
                    let sql = "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.DATE_CREATED, team.CURRENT_TEAM_SIZE, team.MAX_TEAM_SIZE, tr.ROLE, player.AUTH_ID, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on (team.ID = tr.team_ID) JOIN player player on (tr.player_AUTH_ID = player.AUTH_ID) ORDER BY team.ID ASC";
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
     * @param playerId Uses player id to search the teams that they are on
     * @param callback Passes back result with lists of team info
     */
    showAllPlayersTeams(playerId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method showAllPlayersTeams()", {
                class: this.className,
            });
            pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err)
                        throw err;
                    let sql = "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.DATE_CREATED, team.CURRENT_TEAM_SIZE, team.MAX_TEAM_SIZE, tr.ROLE, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on(team.ID = tr.team_ID) JOIN player player on(tr.player_AUTH_ID = player.AUTH_ID) WHERE tr.team_ID IN (SELECT team_ID FROM team_roster WHERE player_AUTH_ID = ?) ORDER BY tr.team_ID ASC";
                    conn.query = (0, util_1.promisify)(conn.query);
                    let result = yield conn.query(sql, [playerId]);
                    return callback(result);
                }
                catch (error) {
                    if (error instanceof Error)
                        winstonConfig_1.default.error("Database Connection / Query Error", {
                            type: error.message,
                            class: this.className,
                        });
                    return callback(null);
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
    createTeam(team, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method createTeam()", {
                class: this.className,
            });
            pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let sqlTeamInsert = "INSERT INTO team (ID, NAME, IMAGE, VISIBILITY) values (?,?,?,?)";
                    conn.query = (0, util_1.promisify)(conn.query);
                    let result = yield conn.query(sqlTeamInsert, [
                        team.$id,
                        team.$name,
                        team.$image,
                        team.$visibility,
                    ]);
                    conn.release();
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
    joinTeam(playerId, teamId, role, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method joinTeam()", {
                class: this.className,
            });
            pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err)
                        throw err;
                    let addPlayerSql = "INSERT INTO team_roster (player_AUTH_ID, team_ID, ROLE) VALUES (?,?,?)";
                    let addTeamSizeSql = "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE + 1 WHERE ID = ?";
                    conn.beginTransaction((err) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            if (err)
                                throw err;
                            conn.query = (0, util_1.promisify)(conn.query);
                            let addPlayerResult = yield conn.query(addPlayerSql, [
                                playerId,
                                teamId,
                                role,
                            ]);
                            let addTeamSizeResult = yield conn.query(addTeamSizeSql, [teamId]);
                            conn.commit((err) => {
                                if (err)
                                    throw err;
                                return callback(addPlayerResult);
                            });
                        }
                        catch (error) {
                            if (error instanceof Error)
                                winstonConfig_1.default.error("Database Connection / Query Error", {
                                    type: error,
                                    class: this.className,
                                });
                            conn.rollback();
                            return callback(null);
                        }
                    }));
                }
                catch (error) {
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
    removePlayerFromTeam(playerId, teamId, callback) {
        winstonConfig_1.default.verbose("Entering method removeFromTeam()", {
            class: this.className,
        });
        let deleteFromTeamSql = "DELETE FROM team_roster WHERE player_AUTH_ID = ? AND team_ID = ?";
        let updateTeamSizeSql = "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE - 1 WHERE ID = ?";
        // try {
        //     conn.query = promisify(conn.query);
        //     let deleteResult = await conn.query(deleteFromTeamSql, [
        //         playerId,
        //         teamId,
        //     ]);
        //     let updateResult = await conn.query(updateTeamSizeSql, [teamId]);
        // } catch (error) {}
    }
    testConnToCloud() {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = null;
            try {
                conn = yield lake.getConnection();
                const [result, fields] = yield conn.query("SELECT * FROM player");
                console.log(result);
                // conn.ping();
                // console.log("server responded");
                // console.log(fields);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    test(playerId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = null;
            let deleteFromTeamSql = "DELETE FROM team_roster WHERE player_AUTH_ID = ? AND team_ID = ?";
            let updateTeamSizeSql = "UPDATE team SET CURRENT_TEAM_SIZE = CURRENT_TEAM_SIZE - 1 WHERE ID = ?";
            let tesSql = "SELECT * FROM team";
            try {
                conn = yield river.getConnection();
                yield conn.beginTransaction();
                // await conn.query(deleteFromTeamSql, [playerId, teamId]);
                let [result, fields] = yield conn.query(tesSql);
                yield conn.commit();
                // console.log(result);
                return result;
            }
            catch (error) {
                if (conn)
                    yield conn.rollback();
                console.log("wow");
                throw error;
            }
            finally {
                if (conn)
                    conn.release();
            }
        });
    }
}
exports.default = PlayerDAO;
let playerdao = new PlayerDAO();
let dummyPlayer = Player_1.Player.SecondaryPlayer(1231325431, "Noah", "Roerig", "ENGLISH", "USER", "MALE", new Date(), "PRIVATE", "1,2023", "NULL", "VALID");
