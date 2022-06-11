import winston from "winston";
import PlayerDAO from "../data/playerDAO";
import { Player } from "../models/Player";
import logger from "../utilities/winstonConfig";

const tempLogger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

const database = new PlayerDAO();

export class PlayerBusinessService {
    // Classname to be used in logger
    className = this.constructor.name;

    /**
     * Makes a call to the data layer method. Will return unfiltered data back
     * from result.
     *
     * @param player player object passed to data layer
     * @param callback callback that returns the result from the database
     */
    public createSecondaryPlayer(player: Player, callback: any) {
        logger.verbose("Entering method createSecondaryPlayer", {
            class: this.className,
        });

        /**
         * Business rule
         *
         * $status is set to valid when passing the player object to the data layer
         */
        player.$status = "VALID";

        database.createSecondaryPlayer(player, (result: any) => {
            if (result === null || result.affectedRows === 0) {
                logger.error("Bad request to Data Layer", {
                    type: result,
                    class: this.className,
                });
                callback({ message: "Database Error", code: -1 });
                return;
            }

            logger.info("Secondary player created", {
                type: `Code 1`,
                class: this.className,
            });
            callback({ message: "Secondary player created", code: 1 });
            return;
        });
    }

    public showAllPlayersTeams(id: string, callback: any) {
        logger.verbose("Entering method showAllPlayersTeams", {
            class: this.className,
        });

        database.showAllPlayersTeams(id, (result: any) => {
            if (result === null) {
                logger.error("Bad request to Data Layer", {
                    class: this.className,
                });
                callback({ message: "Database Error", code: -1 });
                return;
            }

            if (result.length === 0) {
                logger.info(`No teams found with id:${id}`, {
                    class: this.className,
                });
                callback({ message: "No Teams Found", code: 0 });
                return;
            } else {
                let teamAmount = result.length;
                logger.info(`${teamAmount} teams found with id: ${id}`, {
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

    public showAllTeams(callback: any) {
        logger.verbose("Entering method showAllTeams()", {
            class: this.className,
        });

        database.showAllTeams((result: any) => {
            if (result === null) {
                logger.error("Bad request to Data Layer", {
                    class: this.className,
                });
                callback({ message: "Database Error", code: -1 });
                return;
            }

            if (result.length === 0) {
                logger.info("No teams found with id", {
                    class: this.className,
                });
                callback({ message: "No Teams Found", code: 0 });
                return;
            } else {
                let teamAmount = result.length;
                logger.info(`${teamAmount} teams found in network`, {
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

    public joinOpenTeam(playerId: number, teamId: number, callback: any) {
        logger.verbose("Entering method joinOpenTeam()", {
            class: this.className,
        });
        // const profile = tempLogger.startTimer();
        database.getConnectionFromPool((conn: any) => {
            if (conn === null) {
                logger.error("Bad request to Data Layer", {
                    class: this.className,
                });
                return callback({ message: "Database Error", code: -1 });
            }

            database.findTeamVisibility(
                teamId,
                conn,
                (resultVisibility: any) => {
                    if (resultVisibility === null) {
                        logger.error("Bad request to Data Layer", {
                            class: this.className,
                        });
                        return callback({
                            message: "Database Error",
                            code: -1,
                        });
                    }

                    if (
                        resultVisibility[0].VISIBILITY === "PRIVATE" ||
                        resultVisibility[0].VISIBILITY === "CLOSED" ||
                        resultVisibility[0].CURRENT_TEAM_SIZE ===
                            resultVisibility[0].MAX_TEAM_SIZE
                    ) {
                        logger.info("Team is not open OR team is at max size", {
                            class: this.className,
                        });
                        return callback({
                            message: "Team is not open OR team is at max size",
                            code: 0,
                        });
                    }

                    database.joinTeam(
                        playerId,
                        teamId,
                        conn,
                        (joinResult: any) => {
                            if (joinResult === null || joinResult === 0) {
                                logger.error("Bad request to Data Layer", {
                                    class: this.className,
                                });
                                return callback({
                                    message: "Database Error",
                                    code: -1,
                                });
                            }

                            logger.info(
                                `Player with id: ${playerId} joined team with id: ${teamId}`,
                                {
                                    class: this.className,
                                }
                            );

                            return callback({
                                message: "Player joined team",
                                code: 1,
                            });
                        }
                    );
                }
            );
        });
    }
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
// console.log("bruh");

let business = new PlayerBusinessService();
// business.joinOpenTeam();
