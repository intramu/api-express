import { performance, PerformanceObserver } from "perf_hooks";

import PlayerDAO from "../data/playerDAO";
import { Player } from "../models/Player";
import logger from "../utilities/winstonConfig";
import { auth0 } from "../utilities/ManagementApiTokenGen";
import { APIResponse } from "../models/APIResponse";
import { Role, Status, Visibility } from "../utilities/enums";
import TeamDAO from "../data/teamDAO";
import { Team } from "../models/Team";
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
        // sets the player status to active, there account is complete
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
    async createPlayerWithAuth0Account(player: Player): Promise<APIResponse | string> {
        logger.verbose("Entering method createPlayerWithAuth0()", {
            class: this.className,
            values: player,
        });

        // check if organization exists
        const organization = await organizationDatabase.findOrganizationById(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            player.getOrganizationId()!
        );
        if (organization === null) {
            return APIResponse[404](`No Organization found with id: ${player.getOrganizationId()}`);
        }

        const newPlayer: Player = player;
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
            name: `${player.getFirstName()} ${player.getLastName()}`,
            connection: "Username-Password-Authentication",
            password: Math.random().toString(36).slice(-8).concat("1111!"),
            verify_email: true,
        };

        const response = await auth0
            .createUser(newAuthUser)
            .then((result) => {
                logger.debug(`Auth0 user created with id: ${result.user_id}`, {
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

        return response;
    }

    // todo: implement
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

        const teamList = response.filter((team) => team.getStatus() === Status.ACTIVE);

        return teamList;
    }

    async findAllTeamsByOrganizationId(orgId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const org = await organizationDatabase.findOrganizationById(orgId);
        if (org === null) {
            return APIResponse[404](`No organization found with id: ${orgId}`);
        }

        const response = await teamDatabase.findAllTeamsByOrganizationId(orgId);
        if (response.length === 0) {
            return APIResponse[404](`No teams found with organization id: ${orgId}`);
        }

        return response;
    }

    async findAllPlayersByOrganizationId(orgId: string): Promise<APIResponse | Player[]> {
        logger.verbose("Entering method findAllPlayersByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const response = await organizationDatabase.findOrganizationById(orgId);
        if (response === null) {
            return APIResponse[404](`No organization found with id: ${orgId}`);
        }

        const players = await playerDatabase.findPlayersByOrganizationId(orgId);
        if (response === null) {
            return APIResponse[404](`No teams found with organization id: ${orgId}`);
        }

        return players;
    }

    async joinTeam(playerId: string, teamId: number): Promise<APIResponse | boolean> {
        logger.verbose("Entering method joinTeam()", {
            class: this.className,
        });

        const team = await teamDatabase.findTeamByIdWithPlayers(teamId);

        if (team === null) {
            return APIResponse[404](`No Team found with id: ${teamId}`);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (team.getPlayers().length >= team.getMaxTeamSize()!) {
            return APIResponse[409](`Team is full. Max size: ${team.getMaxTeamSize()}`);
        }
        if (team.getPlayers().some((player) => player.getAuthId() === playerId)) {
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
            return APIResponse[500]("Error adding player to roster");
        }

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

        const players = await playerDatabase.findPlayersByTeamId(teamId);

        if (players === null || !players.length) {
            return APIResponse[404](`No team found with id: ${teamId}`);
        }
        if (
            !players.find(
                (player) =>
                    player.getAuthId() === authorizingId && player.getRole() === Role.CAPTAIN
            )
        ) {
            return APIResponse[403](`Id: ${authorizingId} not authorized`);
        }
        if (!players.find((player) => player.getAuthId() === playerId)) {
            return APIResponse[404](`Player: ${playerId} to kick not found`);
        }

        const response = await teamDatabase.removeFromTeamRoster(teamId, playerId);
        if (!response) {
            return APIResponse[500]("Error removing player from roster");
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

    async acceptTeamInvite(playerId: string, teamId: number): Promise<APIResponse | true> {
        logger.verbose("Entering method acceptTeamInvite()", {
            class: this.className,
            values: {
                playerId,
                teamId,
            },
        });

        // if this invite comes back as invalid, it validates that either the team id or the player id
        // was invalid
        const inviteResponse = await playerDatabase.deletePlayerInvite(playerId, teamId);
        if (inviteResponse === null) {
            return APIResponse[404](
                `No invite found with player id: ${playerId} and team id: ${teamId}`
            );
        }

        const response = await teamDatabase.addToTeamRoster(teamId, playerId, Role.PLAYER);
        if (response === false) {
            return APIResponse[500](`Error adding ${playerId} to team ${teamId}`);
        }

        return true;
    }

    async invitePlayerToTeam(
        requestingId: string,
        inviteeId: string,
        teamId: number
    ): Promise<APIResponse | true> {
        logger.verbose("Entering method invitePlayerToTeam()", {
            class: this.className,
            values: {
                requestingId,
                inviteeId,
                teamId,
            },
        });

        // check team exists and is valid for invite
        const team = await teamDatabase.findTeamByIdWithPlayers(teamId);
        if (team === null) {
            return APIResponse[404](`No team found with id: ${teamId}`);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (team.getPlayers().length >= team.getMaxTeamSize()!) {
            return APIResponse[409](`Team is full`);
        }

        // check requesting id is captain
        // check that invitee isnt already on team
        // eslint-disable-next-line consistent-return
        team.getPlayers().forEach((player) => {
            if (
                player.getAuthId() === requestingId &&
                player.getRole() === (Role.CAPTAIN || Role.COCAPTAIN)
            ) {
                return APIResponse[403](
                    `Player ${requestingId} does not possess a valid Role to perform this action`
                );
            }
            if (player.getAuthId() === inviteeId) {
                return APIResponse[409](`Player ${inviteeId} is already on team`);
            }
        });

        // add player invite to database
        // expiration date will be set to 1 week from invite.
        const date = new Date();
        date.setDate(date.getDate() + 7);

        const invite = playerDatabase.createPlayerInvite(requestingId, inviteeId, teamId, date);
        if (invite === null) {
            return APIResponse[500]("Error inviting player to team");
        }

        // todo: send invitee a notification of the invite

        return true;
    }

    async requestToJoinTeam(playerId: string, teamId: number): Promise<APIResponse | true> {
        logger.verbose("Entering method invitePlayerToTeam()", {
            class: this.className,
            values: {
                playerId,
                teamId,
            },
        });

        const team = await teamDatabase.findTeamByIdWithPlayers(teamId);
        if (team === null) {
            return APIResponse[404](`Team id: ${teamId} not found`);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (team.getPlayers().length > team.getMaxTeamSize()!) {
            return APIResponse[409](`Team id: ${teamId} is full`);
        }

        // expiration date is set one week out
        const date = new Date();
        date.setDate(date.getDate() + 7);
        const response = await teamDatabase.createJoinRequest(teamId, playerId, date);
        if (response === false) {
            APIResponse[500](`Error requesting to join team: ${teamId}`);
        }

        return true;
    }

    async acceptJoinRequest(
        requesteeId: string,
        acepteeId: string,
        teamId: number
    ): Promise<APIResponse | true> {
        logger.verbose("Entering method acceptJoinRequest()", {
            class: this.className,
            values: {
                requesteeId,
                acepteeId,
                teamId,
            },
        });

        // check if team exists
        const team = await teamDatabase.findTeamByIdWithPlayers(teamId);
        if (team === null) {
            return APIResponse[404](`No team found with id: ${teamId}`);
        }
        // check that aceptee id possesses valid rights to accept join request
        if (
            !team
                .getPlayers()
                .some(
                    (player) =>
                        (player.getAuthId() === acepteeId && player.getRole() === Role.CAPTAIN) ||
                        player.getRole() === Role.COCAPTAIN
                )
        ) {
            return APIResponse[403](
                `Player ${acepteeId} does not possess a valid Role to perform this action`
            );
        }

        // delete join request
        const deleteResponse = await teamDatabase.deleteJoinRequest(requesteeId, teamId);
        if (deleteResponse === false) {
            return APIResponse[404](
                `No join request found with player id: ${requesteeId} and team id: ${teamId}`
            );
        }

        // add player to team roster
        const response = await teamDatabase.addToTeamRoster(teamId, requesteeId, Role.PLAYER);
        if (response === false) {
            return APIResponse[500](
                `Error joining team with player: ${requesteeId} and team: ${teamId}`
            );
        }

        return true;
    }

    async findOrganizationList(): Promise<APIResponse | [name: string, id: string][]> {
        logger.verbose("Entering method acceptJoinRequest()", {
            class: this.className,
        });

        const orgs = await organizationDatabase.findAllOrganizations();

        if (orgs.length === 0) {
            return APIResponse[404]("No organizations found");
        }

        return orgs.map((organization) => [organization.getName(), organization.getId()]);
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
    // performance.mark("start");
    // console.log(await test.invitePlayerToTeam("player1", "player4", 12));
    // console.log(await test.acceptTeamInvite("player4", 12));
    // console.log(await test.requestToJoinTeam("player4", 12));
    // console.log(await test.acceptJoinRequest("player4", "player1", 12));

    // console.log(await test.viewTeamDetailsById(12));

    console.log(await test.kickPlayerFromTeam("player4", 12, "player2"));
    // console.log(await test.joinTeam("player1", 10));

    // performance.mark("end");

    // performance.measure("example", "start", "end");
}
// const profile = tempLogger.startTimer();
