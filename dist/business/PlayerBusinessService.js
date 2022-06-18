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
exports.PlayerBusinessService = void 0;
const winston_1 = __importDefault(require("winston"));
const playerDAO_1 = __importDefault(require("../data/playerDAO"));
const winstonConfig_1 = __importDefault(require("../utilities/winstonConfig"));
const tempLogger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console()],
});
const database = new playerDAO_1.default();
class PlayerBusinessService {
    constructor() {
        // Classname to be used in logger
        this.className = this.constructor.name;
    }
    /**
     * Makes a call to the data layer method. Will return unfiltered data back
     * from result.
     *
     * @param player player object passed to data layer
     * @param callback callback that returns the result from the database
     */
    createSecondaryPlayer(player, callback) {
        winstonConfig_1.default.verbose("Entering method createSecondaryPlayer", {
            class: this.className,
        });
        // BR - $status is set to valid when passing the player object to the data layer
        player.$status = "VALID";
        database.createSecondaryPlayer(player, (result) => {
            if (result === null || result.affectedRows === 0) {
                winstonConfig_1.default.error("Bad request to Data Layer", {
                    type: result,
                    class: this.className,
                });
                return callback({ message: "Database Error", code: -1 });
            }
            winstonConfig_1.default.info("Secondary player created", {
                type: `Code 1`,
                class: this.className,
            });
            return callback({ message: "Secondary player created", code: 1 });
        });
    }
    showAllPlayersTeams(playerId, callback) {
        winstonConfig_1.default.verbose("Entering method showAllPlayersTeams", {
            class: this.className,
        });
        database.showAllPlayersTeams(playerId, (result) => {
            if (result === null) {
                winstonConfig_1.default.error("Bad request to Data Layer", {
                    class: this.className,
                });
                return callback({ message: "Database Error", code: -1 });
            }
            if (result.length === 0) {
                winstonConfig_1.default.info(`No teams found with id:${playerId}`, {
                    class: this.className,
                });
                return callback({ message: "No Teams Found", code: 0 });
            }
            let teamAmount = result.length;
            winstonConfig_1.default.info(`${teamAmount} teams found with id: ${playerId}`, {
                class: this.className,
            });
            return callback({
                message: `${teamAmount} teams found`,
                code: 1,
                dataPackage: result,
            });
        });
    }
    /**
     * Calls the data layer to get all teams information in the network
     *
     * @returns Returns a formatted json response with a potential list of teams attached
     */
    showAllTeams() {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method showAllTeams()", {
                class: this.className,
            });
            //result from the data layer
            let result = yield database.showAllTeams();
            // if the result came back null it was as caught error in the data layer
            // check logs
            if (result === null) {
                winstonConfig_1.default.error("Bad request to Data Layer", {
                    class: this.className,
                });
                return { message: "Database Error", code: -1 };
            }
            // the .length property on result will not work if the result is not
            // first checked to be an array
            if (Array.isArray(result)) {
                //check if list returned empty
                if (result.length === 0) {
                    winstonConfig_1.default.info("No teams found in network", {
                        class: this.className,
                    });
                    return { message: "No Teams Found", code: 0 };
                }
                //find team amount for logger
                let teamAmount = result.length;
                // if code got to there than a list of teams were found and are returned
                winstonConfig_1.default.info(`${teamAmount} teams found in network`, {
                    class: this.className,
                });
                return {
                    message: `${teamAmount} teams found`,
                    code: 1,
                    dataPackage: result,
                };
            }
        });
    }
    joinOpenTeam(playerId, teamId, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method joinOpenTeam()", {
                class: this.className,
            });
            database.findTeamVisibility(teamId, (visibilityResult) => {
                if (visibilityResult === null) {
                    winstonConfig_1.default.error("Bad request to data layer", {
                        class: this.className,
                    });
                    return callback({ message: "Database Error", code: -1 });
                }
                if (visibilityResult.length === 0) {
                    winstonConfig_1.default.info(`No teams found with id: ${teamId}`, {
                        class: this.className,
                    });
                    return callback({ message: "No teams found", code: 0 });
                }
                if (visibilityResult[0].VISIBILITY === "PRIVATE" ||
                    visibilityResult[0].VISIBILITY === "CLOSED" ||
                    visibilityResult[0].CURRENT_TEAM_SIZE ===
                        visibilityResult[0].MAX_TEAM_SIZE) {
                    winstonConfig_1.default.info("Team is not open OR team is at max size", {
                        class: this.className,
                    });
                    return callback({
                        message: "Team is not open OR team is at max size",
                        code: 0,
                    });
                }
                // BR - when joining an open team the default role is a player
                let role = "PLAYER";
                database.joinTeam(playerId, teamId, role, (joinResult) => {
                    if (joinResult === null || joinResult === 0) {
                        winstonConfig_1.default.error("Bad request to Data Layer", {
                            class: this.className,
                        });
                        return callback({
                            message: "Database Error",
                            code: -1,
                        });
                    }
                    winstonConfig_1.default.info(`Player with id: ${playerId} joined team with id: ${teamId}`, {
                        class: this.className,
                    });
                    return callback({
                        message: "Player joined team",
                        code: 1,
                    });
                });
            });
        });
    }
    createTeam(team, playerId, callback) {
        winstonConfig_1.default.verbose("Entering method createTeam()", {
            class: this.className,
        });
        database.createTeam(team, (createTeamResult) => {
            if (createTeamResult === null ||
                createTeamResult.affectedRows === 0) {
                winstonConfig_1.default.crit("Bad request to Data Layer", {
                    type: createTeamResult,
                    class: this.className,
                });
                return callback({ message: "Database Error", code: -1 });
            }
            let teamId = createTeamResult.insertId;
            // BR - Role is set to captain because this is a createTeam method. We want the user who is currently creating the team to be set as the captain.
            let role = "CAPTAIN";
            database.joinTeam(playerId, teamId, role, (joinTeamResult) => {
                if (joinTeamResult === null || joinTeamResult === 0) {
                    winstonConfig_1.default.crit("Bad request to Data Layer", {
                        type: joinTeamResult,
                        class: this.className,
                    });
                }
                winstonConfig_1.default.info(`Team successfully created with captain id: ${playerId}`, {
                    class: this.className,
                });
                return callback({
                    message: "Team successfully created",
                    code: 1,
                });
            });
        });
    }
    leaveTeam(playerId, teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method leaveTeam()", {
                class: this.className,
            });
            let result = yield database.removePlayerFromTeam(playerId, teamId);
            if (result === null ||
                Array.isArray(result) ||
                result.affectedRows === 0) {
                winstonConfig_1.default.crit("Database Error", {
                    class: this.className,
                });
                return { message: "Database Error", code: -1 };
            }
            winstonConfig_1.default.info(`Player with id: ${playerId} removed from team with id: ${teamId}`);
            return { message: "Player removed from team", code: 1 };
        });
    }
}
exports.PlayerBusinessService = PlayerBusinessService;
// const profile = tempLogger.startTimer();
// database.getConnectionFromPool((conn: any) => {
//     if (conn === null) {
//         logger.error("Bad request to Data Layer", {
//             class: this.className,
//         });
//         return callback({ message: "Database Error", code: -1 });
//     }
//     database.findTeamVisibility(
//         teamId,
//         conn,
//         (resultVisibility: any) => {
//             if (resultVisibility === null) {
//                 logger.error("Bad request to Data Layer", {
//                     class: this.className,
//                 });
//                 return callback({
//                     message: "Database Error",
//                     code: -1,
//                 });
//             }
//             if (
//                 resultVisibility[0].VISIBILITY === "PRIVATE" ||
//                 resultVisibility[0].VISIBILITY === "CLOSED" ||
//                 resultVisibility[0].CURRENT_TEAM_SIZE ===
//                     resultVisibility[0].MAX_TEAM_SIZE
//             ) {
//                 logger.info("Team is not open OR team is at max size", {
//                     class: this.className,
//                 });
//                 return callback({
//                     message: "Team is not open OR team is at max size",
//                     code: 0,
//                 });
//             }
//             database.joinTeam(
//                 playerId,
//                 teamId,
//                 conn,
//                 (joinResult: any) => {
//                     if (joinResult === null || joinResult === 0) {
//                         logger.error("Bad request to Data Layer", {
//                             class: this.className,
//                         });
//                         return callback({
//                             message: "Database Error",
//                             code: -1,
//                         });
//                     }
//                     logger.info(
//                         `Player with id: ${playerId} joined team with id: ${teamId}`,
//                         {
//                             class: this.className,
//                         }
//                     );
//                     return callback({
//                         message: "Player joined team",
//                         code: 1,
//                     });
//                 }
//             );
//         }
//     );
// });
//     public createPrimary(player: Player, callback: any){
//         databasePlayer.createPrimary(player, (result:any)=>{
//             if(result === null){
//                 console.log('Database Error');
//                 callback({message: "Primary Player NOT Created", code: -1})
//             }
//             if(result > 0)
//                 callback({message: "Primary Player Created", code: result})
//             else
//                 callback({message: "Primary Player NOT Created", code: result})
//         })
//     }
// console.log("bruh");
let business = new PlayerBusinessService();
// business.showAllTeams((result: any) => {});
// business.joinOpenTeam("1", 2, (result: any) => {
//     // console.log(result);
// });
