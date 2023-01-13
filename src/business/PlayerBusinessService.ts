import PlayerDAO from "../data/playerDAO";
import { Player } from "../models/Player";
import logger from "../utilities/winstonConfig";
import { auth0 } from "../utilities/ManagementApiTokenGen";
import { APIResponse } from "../models/APIResponse";
import { Role, Visibility } from "../utilities/enums";
import TeamDAO from "../data/teamDAO";
import { Team } from "../models/Team";
import { performance, PerformanceObserver } from "perf_hooks";


const playerDatabase = new PlayerDAO();
const teamDatabase = new TeamDAO();

const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
        console.log(entry);
    })
})

perfObserver.observe({entryTypes: ["measure"], buffered: true})

export class PlayerBusinessService {
    // Classname to be used in logger
    readonly className = this.constructor.name;

    readonly playerRoleId = "rol_BToL9pB5B7MmO2hU";

    /**
     * First makes call to management api to create user. Uses the returned id to assign new player
     * a role. Lastly, makes call to database to add user with new id
     * 
     * @param player object to be added 
     * @param orgId organization id which the player is added under
     * @returns ??? Should return player object with password attached. May need to alter Player model
     */
    async createPlayer(player: Player): Promise<APIResponse | String>
    {
        let newPlayer: Player = player;
        // create body for new user to be added to Auth0 system
        const newAuthUser = {
            // feature: be able to change blocked, verify_email, and email_verified values
            "email": player.getEmailAddress(),
            "user_metadata": { 
                "profile_completion_status": "complete"
            },
            "blocked": false,
            "email_verified": false,
            "given_name": player.getFirstName(),
            "family_name": player.getLastName(),
            "name": player.getFirstName() + " " + player.getLastName(),
            "connection": "Username-Password-Authentication",
            "password": Math.random().toString(36).slice(-8).concat('1111!'),
            "verify_email": true
        }

        const response = await auth0.createUser(newAuthUser)
            .then((result)=>{
                logger.debug("Auth0 user created with id: " + result.user_id, {
                    class: this.className,
                    values: result
                })
                return result
            })
            .catch((err) => {
                logger.error("Error creating Auth0 user", {
                    type: err.message,
                    class: this.className,
                    values: newAuthUser,
                    trace: err
                })
                return null
        })
        
        if(response === null)
        {
            return new APIResponse(500, "Internal Server Error", "Auth0 Error")
        }

        // const authId: string = response.user_id!;

        // todo: this seems unsafe. Auth0 is always guaranteed to return an authid, and if there is an error
        // the function will return before getting here, but its still seems unsafe
        newPlayer.setAuthId(response.user_id!)

        // assign the role player to new user
        auth0.assignRolestoUser({id: newPlayer.getAuthId()!}, { "roles": [this.playerRoleId]})
            .catch((err) => {
                logger.error("Error adding role to Auth0 user", {
                    type: err.message,
                    class: this.className,
                    trace: err
                })
            })
      
        const databaseResponse = await playerDatabase.createPlayerByOrganizationId(newPlayer, player.getOrganizationId());
        
        if(databaseResponse === null)
        {
            logger.error("Could not add user to database", {
                class: this.className,
                values: newPlayer
            })

            return new APIResponse(500, "Internal Server Error", "Error creating user")
        }

        return newAuthUser.password
    }

    async finishPlayerProfile(player: Player){
        logger.verbose("Entering method finishPlayerProfile", {
            class: this.className,
        });

        playerDatabase
    }

    // async 

    // /**
    //  * Makes a call to the data layer method. Will return unfiltered data back
    //  * from result.
    //  *
    //  * @param player player object passed to data layer
    //  * @param callback callback that returns the result from the database
    //  */
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // createSecondaryPlayer(player: Player | any, callback: any) {
    //     logger.verbose("Entering method createSecondaryPlayer", {
    //         class: this.className,
    //     });

    //     // BR - $status is set to valid when passing the player object to the data layer

    //     // ! REVISIT - this might be bad
    //     // eslint-disable-next-line no-param-reassign
    //     player.$status = "VALID";

    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     database.createSecondaryPlayer(player, (result: any) => {
    //         if (result === null || result.affectedRows === 0) {
    //             logger.error("Bad request to Data Layer", {
    //                 type: result,
    //                 class: this.className,
    //             });
    //             return callback({ message: "Database Error", code: -1 });
    //         }

    //         logger.info("Secondary player created", {
    //             type: `Code 1`,
    //             class: this.className,
    //         });
    //         return callback({ message: "Secondary player created", code: 1 });
    //     });
    // }

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // showAllPlayersTeams(playerId: string, callback: any) {
    //     logger.verbose("Entering method showAllPlayersTeams", {
    //         class: this.className,
    //     });

    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     database.showAllPlayersTeams(playerId, (result: any) => {
    //         if (result === null) {
    //             logger.error("Bad request to Data Layer", {
    //                 class: this.className,
    //             });
    //             return callback({ message: "Database Error", code: -1 });
    //         }

    //         if (result.length === 0) {
    //             logger.info(`No teams found with id:${playerId}`, {
    //                 class: this.className,
    //             });
    //             return callback({ message: "No Teams Found", code: 0 });
    //         }

    //         const teamAmount = result.length;
    //         logger.info(`${teamAmount} teams found with id: ${playerId}`, {
    //             class: this.className,
    //         });
    //         return callback({
    //             message: `${teamAmount} teams found`,
    //             code: 1,
    //             dataPackage: result,
    //         });
    //     });
    // }

    // /**
    //  * Calls the data layer to get all teams information in the network
    //  *
    //  * @returns Returns a formatted json response with a potential list of teams attached
    //  */
    // // eslint-disable-next-line consistent-return
    // async showAllTeams(): Promise<
    //     | { message: string; code: number; dataPackage?: undefined }
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     | { message: string; code: number; dataPackage: any[] }
    //     | undefined
    // > {
    //     logger.verbose("Entering method showAllTeams()", {
    //         class: this.className,
    //     });

    //     // result from the data layer
    //     const result = await database.showAllTeams();

    //     // if the result came back null it was as caught error in the data layer
    //     // check logs
    //     if (result === null) {
    //         logger.error("Bad request to Data Layer", {
    //             class: this.className,
    //         });
    //         return { message: "Database Error", code: -1 };
    //     }

    //     // the .length property on result will not work if the result is not
    //     // first checked to be an array
    //     if (Array.isArray(result)) {
    //         // check if list returned empty
    //         if (result.length === 0) {
    //             logger.info("No teams found in network", {
    //                 class: this.className,
    //             });
    //             return { message: "No Teams Found", code: 0 };
    //         }

    //         // find team amount for logger
    //         const teamAmount = result.length;

    //         // if code got to there than a list of teams were found and are returned
    //         logger.info(`${teamAmount} teams found in network`, {
    //             class: this.className,
    //         });
    //         return {
    //             message: `${teamAmount} teams found`,
    //             code: 1,
    //             dataPackage: result,
    //         };
    //     }
    // }


    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async joinTeam(playerId: string, teamId: number): Promise<APIResponse | boolean> {
        logger.verbose("Entering method joinTeam()", {
            class: this.className,
        });

        const playerList = await playerDatabase.findPlayersByTeamId(teamId)
        const team = await teamDatabase.findTeamById(teamId)

        if(team === null){
            return new APIResponse(404, "Not Found", `Team not found with id: ${teamId}`)
        }
        if(playerList === null || !playerList.length){
            return new APIResponse(404, "Not Found", `No players on team: ${teamId}`)
        }
        if(playerList.length >= team.getMaxTeamSize()!){
            return new APIResponse(409, "Conflict", `Team is full. Max size: ${team.getMaxTeamSize()}`);
        }
        if(!!playerList.find((player) => player.getAuthId() === playerId)){
            return new APIResponse(409, "Conflict", `Player ${playerId} is already on team`)
        }
        if(team.getVisibility() === Visibility.CLOSED || team.getVisibility() === Visibility.PRIVATE){
            return new APIResponse(403, "Forbidden", `Team visibility: ${team.getVisibility()}`)
        }

        const responseAdd = await teamDatabase.addToTeamRoster(teamId, playerId, Role.PLAYER)
        if(!responseAdd){
            return new APIResponse(500, "Internal Server Error", "Server encountered error adding player")
        }

        console.log("playerList: ", playerList);
        console.log("team:", team);

        return true;
    }

    async kickPlayerFromTeam(playerId: string, teamId: number, authorizingId: string): Promise<APIResponse | boolean>{
        logger.verbose("Entering method kickPlayerFromTeam()", {
            class: this.className,
        });

        const playerList = await playerDatabase.findPlayersByTeamId(teamId);

        if(playerList === null || !playerList.length){
            return new APIResponse(404, "Not Found", `No players on team: ${teamId}`)
        }
        if(!playerList.find((player) => 
            player.getAuthId() === authorizingId && player.getRole() === Role.CAPTAIN))
        {
            return new APIResponse(403, "Forbidden", `Id ${authorizingId} not authorized`)
        }
        if(!playerList.find((player) => player.getAuthId() === playerId)){
            return new APIResponse(404, "Not Found", `Player ${playerId} to kick not found`)
        }

        const response = await teamDatabase.removeFromTeamRoster(teamId, playerId);
        if(!response){
            return new APIResponse(500, "Internal Server Error", "Server encountered error removing player")
        }

        return true;
    }

    async viewTeamDetailsById(teamId: number): Promise<APIResponse | Team>{
        logger.verbose("Entering method viewTeamDetailsById()", {
            class: this.className,
        });

        const team = await teamDatabase.findTeamById(teamId)
        const playerList = await playerDatabase.findPlayersByTeamId(teamId)

        // console.log("playerList: ", playerList);
        // console.log("team:", team);    

        if(team === null){
            return new APIResponse(404, "Not Found", `No team found with id: ${teamId}`)
        }
        if(playerList === null || !playerList.length){
            return new APIResponse(404, "Not Found", `No players on team: ${teamId}`)
        }

        team.setPlayers(playerList);

        return team;
    }

    async updateTeamDetails(team: Team): Promise<APIResponse | Team>{
        logger.verbose("Entering method updateTeamDetails()", {
            class: this.className,
        });

        const result = await teamDatabase.findTeamById(team.getId())

        if(result === null){
            return new APIResponse(404, "Not Found", `No team found with id: ${team.getId()}`)
        }

        const updatedTeam = await teamDatabase.updateTeam(team);
        
        if(updatedTeam === null){
            return new APIResponse(500, "Internal Server Error", `Error updating team: ${team.getId()}`)
        }

        return updatedTeam;
    }

    async createTeam(team: Team): Promise<APIResponse | Team>{
        logger.verbose("Entering method createTeam()", {
            class: this.className,
            values: team
        });

        const result = await teamDatabase.createTeam(team);

        if(result === null){
            return new APIResponse(500, "Internal Server Error", `Error creating team`)
        }

        return result
    }

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // createTeam(team: Team, playerId: string, callback: any) {
    //     logger.verbose("Entering method createTeam()", {
    //         class: this.className,
    //     });

    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any, consistent-return
    //     database.createTeam(team, (createTeamResult: any) => {
    //         if (createTeamResult === null || createTeamResult.affectedRows === 0) {
    //             logger.crit("Bad request to Data Layer", {
    //                 type: createTeamResult,
    //                 class: this.className,
    //             });
    //             return callback({ message: "Database Error", code: -1 });
    //         }

    //         const teamId = createTeamResult.insertId;
    //         // BR - Role is set to captain because this is a createTeam method. We want the user who is currently creating the team to be set as the captain.
    //         const role = "CAPTAIN";
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         database.joinTeam(playerId, teamId, role, (joinTeamResult: any) => {
    //             if (joinTeamResult === null || joinTeamResult === 0) {
    //                 logger.crit("Bad request to Data Layer", {
    //                     type: joinTeamResult,
    //                     class: this.className,
    //                 });
    //             }

    //             logger.info(`Team successfully created with captain id: ${playerId}`, {
    //                 class: this.className,
    //             });
    //             return callback({
    //                 message: "Team successfully created",
    //                 code: 1,
    //             });
    //         });
    //     });
    // }

}
const test = new PlayerBusinessService()

// const player = new Player(
//     null,
//     "Stevan",
//     "Perrino", 
//     "",
//     "sPerrino@gmail.com",
//     "505",
//     null,
//     "MALE",
//     new Date(),
//     "",
//     "SPRING_2023",
//     null,
//     "",
//     new Date()
// );
// test.createPlayer(player, "7f83b6f4-754a-4f34-913d-907c1226321f")
// test.joinTeam("player1", 12);

testFunc()
async function testFunc(){
    performance.mark("start")
    console.log(await test.viewTeamDetailsById(12));
    
    // console.log(await test.kickPlayerFromTeam("player2", 12, "player1"));
    // console.log(await test.joinTeam("player2", 12));
    
    performance.mark("end")

    performance.measure("example", "start", "end")
}
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

//     createPrimary(player: Player, callback: any){
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

// business.showAllTeams((result: any) => {});
// business.joinOpenTeam("1", 2, (result: any) => {
//     // console.log(result);
// });

