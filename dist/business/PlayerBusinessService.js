"use strict";
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
        /**
         * Business rule
         *
         * $status is set to valid when passing the player object to the data layer
         */
        player.$status = "VALID";
        database.createSecondaryPlayer(player, (result) => {
            if (result === null || result.affectedRows === 0) {
                winstonConfig_1.default.error("Bad request to Data Layer", {
                    type: result,
                    class: this.className,
                });
                callback({ message: "Database Error", code: -1 });
                return;
            }
            winstonConfig_1.default.info("Secondary player created", {
                type: `Code 1`,
                class: this.className,
            });
            callback({ message: "Secondary player created", code: 1 });
            return;
        });
    }
    showAllPlayersTeams(id, callback) {
        winstonConfig_1.default.verbose("Entering method showAllPlayersTeams", {
            class: this.className,
        });
        database.showAllPlayersTeams(id, (result) => {
            if (result === null) {
                winstonConfig_1.default.error("Bad request to Data Layer", {
                    class: this.className,
                });
                callback({ message: "Database Error", code: -1 });
                return;
            }
            if (result.length === 0) {
                winstonConfig_1.default.info(`No teams found with id:${id}`, {
                    class: this.className,
                });
                callback({ message: "No Teams Found", code: 0 });
                return;
            }
            else {
                let teamAmount = result.length;
                winstonConfig_1.default.info(`${teamAmount} teams found with id: ${id}`, {
                    class: this.className,
                });
                callback({
                    message: `${teamAmount} teams found`,
                    code: 1,
                    dataPackage: result,
                });
            }
        });
    }
    showAllTeams(callback) {
        winstonConfig_1.default.verbose("Entering method showAllTeams()", {
            class: this.className,
        });
        database.showAllTeams((result) => {
            if (result === null) {
                winstonConfig_1.default.error("Bad request to Data Layer", {
                    class: this.className,
                });
                callback({ message: "Database Error", code: -1 });
                return;
            }
            if (result.length === 0) {
                winstonConfig_1.default.info("No teams found with id", {
                    class: this.className,
                });
                callback({ message: "No Teams Found", code: 0 });
                return;
            }
            else {
                let teamAmount = result.length;
                winstonConfig_1.default.info(`${teamAmount} teams found in network`, {
                    class: this.className,
                });
                callback({
                    message: `${teamAmount} teams found`,
                    code: 1,
                    dataPackage: result,
                });
            }
        });
    }
    joinOpenTeam(playerId, teamId, callback) {
        winstonConfig_1.default.verbose("Entering method joinOpenTeam()", {
            class: this.className,
        });
        // const profile = tempLogger.startTimer();
        database.getConnectionFromPool((conn) => {
            if (conn === null) {
                winstonConfig_1.default.error("Bad request to Data Layer", {
                    class: this.className,
                });
                return callback({ message: "Database Error", code: -1 });
            }
            database.findTeamVisibility(teamId, conn, (resultVisibility) => {
                if (resultVisibility === null) {
                    winstonConfig_1.default.error("Bad request to Data Layer", {
                        class: this.className,
                    });
                    return callback({
                        message: "Database Error",
                        code: -1,
                    });
                }
                if (resultVisibility[0].VISIBILITY === "PRIVATE" ||
                    resultVisibility[0].VISIBILITY === "CLOSED" ||
                    resultVisibility[0].CURRENT_TEAM_SIZE ===
                        resultVisibility[0].MAX_TEAM_SIZE) {
                    winstonConfig_1.default.info("Team is not open OR team is at max size", {
                        class: this.className,
                    });
                    return callback({
                        message: "Team is not open OR team is at max size",
                        code: 0,
                    });
                }
                database.joinTeam(playerId, teamId, conn, (joinResult) => {
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
}
exports.PlayerBusinessService = PlayerBusinessService;
// console.log("bruh");
let business = new PlayerBusinessService();
// business.joinOpenTeam();
