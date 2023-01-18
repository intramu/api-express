import PlayerDAO from "../data/playerDAO";
import { Player } from "../models/Player";
import logger from "../utilities/winstonConfig";
import { auth0 } from "../utilities/ManagementApiTokenGen";
import { APIResponse } from "../models/APIResponse";
import { Role, Status, Visibility } from "../utilities/enums";
import TeamDAO from "../data/teamDAO";
import { Team } from "../models/Team";
import { performance, PerformanceObserver } from "perf_hooks";
import OrganizationDAO from "../data/organizationDAO";

const playerDatabase = new PlayerDAO();
const teamDatabase = new TeamDAO();
const organizationDatabase = new OrganizationDAO();

const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach((entry) => {
        console.log(entry);
    });
});

perfObserver.observe({ entryTypes: ["measure"], buffered: true });

export class PlayerBusinessService {
    readonly className = this.constructor.name;

    // needs a home
    readonly playerRoleId = "rol_BToL9pB5B7MmO2hU";

    async createPlayer(player: Player): Promise<APIResponse | Player> {
        logger.verbose("Entering method createPlayer()", {
            class: this.className,
            values: player,
        });

        const organization = await organizationDatabase.findOrganizationById(
            player.getOrganizationId()!
        );

        if (organization === null) {
            return APIResponse[404](`No Organization found with id: ${player.getOrganizationId()}`);
        }

        const newPlayer: Player = player;
        //sets the player status to active, there account is complete
        newPlayer.setStatus(Status.ACTIVE);

        const response = await playerDatabase.createPlayerByOrganizationId(player);

        if (response === null) {
            return APIResponse[500](`Error creating player`);
        }

        return player;
    }

    /**
     * First makes call to management api to create user. Uses the returned id to assign new player
     * a role. Lastly, makes call to database to add user with new id
     *
     * @param player object to be added
     * @param orgId organization id which the player is added under
     * @returns ??? Should return player object with password attached. May need to alter Player model
     */
    async createPlayerWithAuth0Account(player: Player): Promise<APIResponse | String> {
        logger.verbose("Entering method createPlayerWithAuth0()", {
            class: this.className,
            values: player,
        });

        //check if organization exists
        const organization = await organizationDatabase.findOrganizationById(
            player.getOrganizationId()!
        );

        if (organization === null) {
            return APIResponse[404](`No Organization found with id: ${player.getOrganizationId()}`);
        }

        let newPlayer: Player = player;
        // create body for new user to be added to Auth0 system
        const newAuthUser = {
            // todo: be able to change blocked, verify_email, and email_verified values
            email: player.getEmailAddress(),
            user_metadata: {
                profile_completion_status: "complete",
            },
            blocked: false,
            email_verified: false,
            given_name: player.getFirstName(),
            family_name: player.getLastName(),
            name: player.getFirstName() + " " + player.getLastName(),
            connection: "Username-Password-Authentication",
            password: Math.random().toString(36).slice(-8).concat("1111!"),
            verify_email: true,
        };

        const response = await auth0
            .createUser(newAuthUser)
            .then((result) => {
                logger.debug("Auth0 user created with id: " + result.user_id, {
                    class: this.className,
                    values: result,
                });
                return result;
            })
            .catch((err) => {
                logger.error("Error creating Auth0 user", {
                    type: err.message,
                    class: this.className,
                    values: newAuthUser,
                    trace: err,
                });
                return null;
            });

        if (response === null) {
            return APIResponse[500]("Auth0 Error");
        }

        // const authId: string = response.user_id!;

        // todo: this seems unsafe. Auth0 is always guaranteed to return an authid, and if there is an error
        // the function will return before getting here, but its still seems unsafe
        newPlayer.setAuthId(response.user_id!);

        // assign the role player to new user
        auth0
            .assignRolestoUser({ id: newPlayer.getAuthId()! }, { roles: [this.playerRoleId] })
            .catch((err) => {
                logger.error("Error adding role to Auth0 user", {
                    type: err.message,
                    class: this.className,
                    trace: err,
                });
            });

        const databaseResponse = await playerDatabase.createPlayerByOrganizationId(newPlayer);

        if (databaseResponse === null) {
            logger.error("Could not add user to database", {
                class: this.className,
                values: newPlayer,
            });

            return APIResponse[500]("Error creating player");
        }

        return newAuthUser.password;
    }

    /**
     * Uses player id to search for player
     * @param playerId - authId used for search
     * @returns - Returns all player data in internal database
     */
    async findPlayerById(playerId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method findPlayerById", {
            class: this.className,
            values: playerId,
        });

        const response = await playerDatabase.findPlayerById(playerId);

        if (response === null) {
            return APIResponse[404](`No player found with id: ${playerId}`, null);
        }

        // const player: Player = response;
        return response;
    }

    async completePlayerProfile(player: Player): Promise<APIResponse | Player> {
        logger.verbose("Entering method finishPlayerProfile", {
            class: this.className,
        });

        // const response = await playerDatabase.patchPlayer(player);

        // if (response === null) {
        //     return APIResponse[404](`No player found with id ${player.getAuthId()}`);
        // }

        // seems unsafe
        // const authResponse = await auth0.updateUser(
        //     { id: response.getAuthId()! },
        //     { user_metadata: { profile_completion_status: "complete" } }
        // );

        const authResponse = await auth0.updateUser(
            { id: player.getAuthId()! },
            { user_metadata: { profile_completion_status: "complete" } }
        );

        console.log(authResponse);

        // return response;
        return APIResponse[501]();
    }

    /**
     * Creates new team, player becomes captain
     *
     * @param team - team object passed to database
     * @param playerId - player that will be set as captain of the team
     * @returns - returns single team object with added details
     */
    async createTeam(team: Team, playerId: string): Promise<APIResponse | Team> {
        logger.verbose("Entering method createTeam()", {
            class: this.className,
            values: team,
        });

        const organization = await organizationDatabase.findOrganizationById(
            team.getOrganizationId()
        );
        if (organization === null) {
            return APIResponse[404](`No organization found with id: ${team.getOrganizationId()}`);
        }

        const player = await playerDatabase.findPlayerById(playerId);
        if (player === null) {
            return APIResponse[404](`No player found with id: ${playerId}`);
        }

        const response = await teamDatabase.createTeam(team, playerId);
        if (response === null) {
            return APIResponse[500]("Database error");
        }

        return response;
    }

    /**
     * Shows all teams active teams available for this term. These teams appear in discovery
     * section. Does not include past semester teams
     * @returns - list of active teams
     */
    async findAllActiveTeams(orgId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findAllActiveTeams()", {
            class: this.className,
            values: orgId,
        });

        const response = await teamDatabase.findAllTeamsByOrganizationId(orgId);

        if (response.length === 0 || response === undefined) {
            return APIResponse[404](`No teams found with id ${orgId}`);
        }

        const teamList = response.filter((team) => {
            if (team.getStatus() === Status.ACTIVE) {
                return team;
            }
        });

        return teamList;
    }

    async findAllTeamsByOrganizationId(orgId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const response = await teamDatabase.findAllTeamsByOrganizationId(orgId);

        if (response.length === 0) {
            return APIResponse[404](`No teams found with organization id ${orgId}`);
        }

        return response;
    }

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async joinTeam(playerId: string, teamId: number): Promise<APIResponse | boolean> {
        logger.verbose("Entering method joinTeam()", {
            class: this.className,
        });

        const playerList = await playerDatabase.findPlayersByTeamId(teamId);
        const team = await teamDatabase.findTeamById(teamId);

        if (team === null) {
            return APIResponse[404](`Team not found with id: ${teamId}`);
        }
        if (playerList === null || !playerList.length) {
            return APIResponse[404](`No players on team: ${teamId}`);
        }
        if (playerList.length >= team.getMaxTeamSize()!) {
            return APIResponse[409](`Team is full. Max size: ${team.getMaxTeamSize()}`);
        }
        if (!!playerList.find((player) => player.getAuthId() === playerId)) {
            return APIResponse[409](`Player ${playerId} is already on team`);
        }
        if (
            team.getVisibility() === Visibility.CLOSED ||
            team.getVisibility() === Visibility.PRIVATE
        ) {
            return APIResponse[403](`Team visibility: ${team.getVisibility()}`);
        }

        const responseAdd = await teamDatabase.addToTeamRoster(teamId, playerId, Role.PLAYER);
        if (!responseAdd) {
            return APIResponse[500]("Server encountered error adding player");
        }

        console.log("playerList: ", playerList);
        console.log("team:", team);

        return true;
    }

    async kickPlayerFromTeam(
        playerId: string,
        teamId: number,
        authorizingId: string
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method kickPlayerFromTeam()", {
            class: this.className,
        });

        const playerList = await playerDatabase.findPlayersByTeamId(teamId);

        if (playerList === null || !playerList.length) {
            return APIResponse[404](`No players on team: ${teamId}`);
        }
        if (
            !playerList.find(
                (player) =>
                    player.getAuthId() === authorizingId && player.getRole() === Role.CAPTAIN
            )
        ) {
            return APIResponse[403](`Id ${authorizingId} not authorized`);
        }
        if (!playerList.find((player) => player.getAuthId() === playerId)) {
            return APIResponse[404](`Player ${playerId} to kick not found`);
        }

        const response = await teamDatabase.removeFromTeamRoster(teamId, playerId);
        if (!response) {
            return APIResponse[500]("Server encountered error removing player");
        }

        return true;
    }

    async findTeamById(teamId: number): Promise<APIResponse | Team> {
        logger.verbose("Entering method findTeamById()", {
            class: this.className,
        });

        const team = await teamDatabase.findTeamByIdWithPlayers(teamId);

        if (team === null) {
            return APIResponse[404](`No team found with id: ${teamId}`);
        }

        return team;
    }

    async updateTeamDetails(team: Team): Promise<APIResponse | Team> {
        logger.verbose("Entering method updateTeamDetails()", {
            class: this.className,
        });

        const result = await teamDatabase.findTeamById(team.getId()!);

        if (result === null) {
            return APIResponse[404](`No team found with id: ${team.getId()}`);
        }

        const updatedTeam = await teamDatabase.updateTeam(team);

        if (updatedTeam === null) {
            return APIResponse[500](`Error updating team: ${team.getId()}`);
        }

        return updatedTeam;
    }
}
const test = new PlayerBusinessService();

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

testFunc();
async function testFunc() {
    performance.mark("start");
    // console.log(await test.viewTeamDetailsById(12));

    // console.log(await test.kickPlayerFromTeam("player2", 12, "player1"));
    // console.log(await test.joinTeam("player2", 12));

    performance.mark("end");

    performance.measure("example", "start", "end");
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
