"use strict";
// import winston from "winston";
// import PlayerDAO from "../data/playerDAO";
// import { Player } from "../models/Player";
// import { Team } from "../models/Team";
// import logger from "../utilities/winstonConfig";
// const tempLogger = winston.createLogger({
//     level: "info",
//     format: winston.format.json(),
//     transports: [new winston.transports.Console()],
// });
// const database = new PlayerDAO();
// export class PlayerBusinessService {
//     // Classname to be used in logger
//     className = this.constructor.name;
//     /**
//      * Makes a call to the data layer method. Will return unfiltered data back
//      * from result.
//      *
//      * @param player player object passed to data layer
//      * @param callback callback that returns the result from the database
//      */
//     public createSecondaryPlayer(player: Player, callback: any) {
//         logger.verbose("Entering method createSecondaryPlayer", {
//             class: this.className,
//         });
//         // BR - $status is set to valid when passing the player object to the data layer
//         player.$status = "VALID";
//         database.createSecondaryPlayer(player, (result: any) => {
//             if (result === null || result.affectedRows === 0) {
//                 logger.error("Bad request to Data Layer", {
//                     type: result,
//                     class: this.className,
//                 });
//                 return callback({ message: "Database Error", code: -1 });
//             }
//             logger.info("Secondary player created", {
//                 type: `Code 1`,
//                 class: this.className,
//             });
//             return callback({ message: "Secondary player created", code: 1 });
//         });
//     }
//     public showAllPlayersTeams(playerId: string, callback: any) {
//         logger.verbose("Entering method showAllPlayersTeams", {
//             class: this.className,
//         });
//         database.showAllPlayersTeams(playerId, (result: any) => {
//             if (result === null) {
//                 logger.error("Bad request to Data Layer", {
//                     class: this.className,
//                 });
//                 return callback({ message: "Database Error", code: -1 });
//             }
//             if (result.length === 0) {
//                 logger.info(`No teams found with id:${playerId}`, {
//                     class: this.className,
//                 });
//                 return callback({ message: "No Teams Found", code: 0 });
//             }
//             let teamAmount = result.length;
//             logger.info(`${teamAmount} teams found with id: ${playerId}`, {
//                 class: this.className,
//             });
//             return callback({
//                 message: `${teamAmount} teams found`,
//                 code: 1,
//                 dataPackage: result,
//             });
//         });
//     }
//     public showAllTeams(callback: any) {
//         logger.verbose("Entering method showAllTeams()", {
//             class: this.className,
//         });
//         database.showAllTeams((result: any) => {
//             if (result === null) {
//                 logger.error("Bad request to Data Layer", {
//                     class: this.className,
//                 });
//                 return callback({ message: "Database Error", code: -1 });
//             }
//             if (result.length === 0) {
//                 logger.info("No teams found with id", {
//                     class: this.className,
//                 });
//                 return callback({ message: "No Teams Found", code: 0 });
//             } else {
//                 let teamAmount = result.length;
//                 logger.info(`${teamAmount} teams found in network`, {
//                     class: this.className,
//                 });
//                 return callback({
//                     message: `${teamAmount} teams found`,
//                     code: 1,
//                     dataPackage: result,
//                 });
//             }
//         });
//     }
//     async joinOpenTeam(playerId: string, teamId: number, callback: any) {
//         logger.verbose("Entering method joinOpenTeam()", {
//             class: this.className,
//         });
//         database.findTeamVisibility(teamId, (visibilityResult: any) => {
//             if (visibilityResult === null) {
//                 logger.error("Bad request to data layer", {
//                     class: this.className,
//                 });
//                 return callback({ message: "Database Error", code: -1 });
//             }
//             if (visibilityResult.length === 0) {
//                 logger.info(`No teams found with id: ${teamId}`, {
//                     class: this.className,
//                 });
//                 return callback({ message: "No teams found", code: 0 });
//             }
//             if (
//                 visibilityResult[0].VISIBILITY === "PRIVATE" ||
//                 visibilityResult[0].VISIBILITY === "CLOSED" ||
//                 visibilityResult[0].CURRENT_TEAM_SIZE ===
//                     visibilityResult[0].MAX_TEAM_SIZE
//             ) {
//                 logger.info("Team is not open OR team is at max size", {
//                     class: this.className,
//                 });
//                 return callback({
//                     message: "Team is not open OR team is at max size",
//                     code: 0,
//                 });
//             }
//             // BR - when joining an open team the default role is a player
//             let role = "PLAYER";
//             database.joinTeam(playerId, teamId, role, (joinResult: any) => {
//                 if (joinResult === null || joinResult === 0) {
//                     logger.error("Bad request to Data Layer", {
//                         class: this.className,
//                     });
//                     return callback({
//                         message: "Database Error",
//                         code: -1,
//                     });
//                 }
//                 logger.info(
//                     `Player with id: ${playerId} joined team with id: ${teamId}`,
//                     {
//                         class: this.className,
//                     }
//                 );
//                 return callback({
//                     message: "Player joined team",
//                     code: 1,
//                 });
//             });
//         });
//     }
//     public createTeam(team: Team, playerId: string, callback: any) {
//         logger.verbose("Entering method createTeam()", {
//             class: this.className,
//         });
//         database.createTeam(team, (createTeamResult: any) => {
//             if (
//                 createTeamResult === null ||
//                 createTeamResult.affectedRows === 0
//             ) {
//                 logger.crit("Bad request to Data Layer", {
//                     type: createTeamResult,
//                     class: this.className,
//                 });
//                 return callback({ message: "Database Error", code: -1 });
//             }
//             let teamId = createTeamResult.insertId;
//             // BR - Role is set to captain because this is a createTeam method. We want the user who is currently creating the team to be set as the captain.
//             let role = "CAPTAIN";
//             database.joinTeam(playerId, teamId, role, (joinTeamResult: any) => {
//                 if (joinTeamResult === null || joinTeamResult === 0) {
//                     logger.crit("Bad request to Data Layer", {
//                         type: joinTeamResult,
//                         class: this.className,
//                     });
//                 }
//                 logger.info(
//                     `Team successfully created with captain id: ${playerId}`,
//                     {
//                         class: this.className,
//                     }
//                 );
//                 return callback({
//                     message: "Team successfully created",
//                     code: 1,
//                 });
//             });
//         });
//     }
//     public leaveTeam(playerId: string, teamId: number, callback: any) {
//         logger.verbose("Entering method leaveTeam()", {
//             class: this.className,
//         });
//         database.removePlayerFromTeam(playerId, teamId, (result: any) => {
//             if (result === null || result.affectedRows === 0) {
//                 logger.crit("Database Error", {
//                     class: this.className,
//                 });
//                 return callback({ message: "Database Error", code: -1 });
//             }
//             logger.info(
//                 `Player with id: ${playerId} removed from team with id: ${teamId}`
//             );
//             return callback({ message: "Player removed from team", code: 1 });
//         });
//     }
//     // const profile = tempLogger.startTimer();
//     // database.getConnectionFromPool((conn: any) => {
//     //     if (conn === null) {
//     //         logger.error("Bad request to Data Layer", {
//     //             class: this.className,
//     //         });
//     //         return callback({ message: "Database Error", code: -1 });
//     //     }
//     //     database.findTeamVisibility(
//     //         teamId,
//     //         conn,
//     //         (resultVisibility: any) => {
//     //             if (resultVisibility === null) {
//     //                 logger.error("Bad request to Data Layer", {
//     //                     class: this.className,
//     //                 });
//     //                 return callback({
//     //                     message: "Database Error",
//     //                     code: -1,
//     //                 });
//     //             }
//     //             if (
//     //                 resultVisibility[0].VISIBILITY === "PRIVATE" ||
//     //                 resultVisibility[0].VISIBILITY === "CLOSED" ||
//     //                 resultVisibility[0].CURRENT_TEAM_SIZE ===
//     //                     resultVisibility[0].MAX_TEAM_SIZE
//     //             ) {
//     //                 logger.info("Team is not open OR team is at max size", {
//     //                     class: this.className,
//     //                 });
//     //                 return callback({
//     //                     message: "Team is not open OR team is at max size",
//     //                     code: 0,
//     //                 });
//     //             }
//     //             database.joinTeam(
//     //                 playerId,
//     //                 teamId,
//     //                 conn,
//     //                 (joinResult: any) => {
//     //                     if (joinResult === null || joinResult === 0) {
//     //                         logger.error("Bad request to Data Layer", {
//     //                             class: this.className,
//     //                         });
//     //                         return callback({
//     //                             message: "Database Error",
//     //                             code: -1,
//     //                         });
//     //                     }
//     //                     logger.info(
//     //                         `Player with id: ${playerId} joined team with id: ${teamId}`,
//     //                         {
//     //                             class: this.className,
//     //                         }
//     //                     );
//     //                     return callback({
//     //                         message: "Player joined team",
//     //                         code: 1,
//     //                     });
//     //                 }
//     //             );
//     //         }
//     //     );
//     // });
//     //     public createPrimary(player: Player, callback: any){
//     //         databasePlayer.createPrimary(player, (result:any)=>{
//     //             if(result === null){
//     //                 console.log('Database Error');
//     //                 callback({message: "Primary Player NOT Created", code: -1})
//     //             }
//     //             if(result > 0)
//     //                 callback({message: "Primary Player Created", code: result})
//     //             else
//     //                 callback({message: "Primary Player NOT Created", code: result})
//     //         })
//     //     }
// }
// // console.log("bruh");
// let business = new PlayerBusinessService();
// // business.joinOpenTeam("1", 2, (result: any) => {
// //     // console.log(result);
// // });
