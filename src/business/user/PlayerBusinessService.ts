import PlayerDAO from "../../data/playerDAO";
import { Player } from "../../models/Player";
import logger from "../../utilities/winstonConfig";
import { APIResponse } from "../../models/APIResponse";
import { PlayerStatus, PlayerVisibility } from "../../utilities/enums/userEnum";
import TeamDAO from "../../data/teamDAO";
import OrganizationDAO from "../../data/organizationDAO";
import { TeamRole } from "../../utilities/enums/teamEnum";
import { Team } from "../../models/Team";

const playerDatabase = new PlayerDAO();
const teamDatabase = new TeamDAO();
const organizationDatabase = new OrganizationDAO();

export class PlayerBusinessService {
    readonly className = this.constructor.name;

    /**
     * Searches for other player using playerId
     * @param authId - user requesting for other player details
     * @param playerId - id of player being searched for
     * @returns - Player or error response
     */
    async findPlayerById(authId: string, playerId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
            values: { playerId, authId },
        });

        // FEATURE- authId(requesting Id) can be used to prevent user's from accessing certain players

        const player = await playerDatabase.findPlayerById(playerId);
        if (player === null) {
            return APIResponse.NotFound(`No player found with id: ${playerId}`);
        }

        if (player.getVisibility() === PlayerVisibility.CLOSED) {
            return APIResponse.Conflict(`Player visibility is ${player.getVisibility()}`);
        }

        return player;
    }

    /**
     * Finds requesting players profile details by using Id
     * @param authId of requesting player
     * @returns Player or
     * @returns Error Response
     */
    async findPlayerProfile(authId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method findPlayerProfile()", {
            class: this.className,
            values: authId,
        });

        const player = await playerDatabase.findPlayerById(authId);
        if (player === null) {
            return APIResponse.NotFound(`No player found with id: ${authId}`);
        }

        return player;
    }

    /**
     * Player creates new account with auth0. This finishes their profile by adding details
     * to internal database.
     * @param player - player details to be added
     * @param orgId - id of organization to add player too
     * @returns - error response or newly created player object
     */
    async completePlayerProfile(player: Player, orgId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method completePlayerProfile", {
            class: this.className,
            values: { player, orgId },
        });

        const organization = await organizationDatabase.findOrganizationByPlayerId(orgId);
        if (organization === null) {
            return APIResponse.NotFound(`No Organization found with id: ${orgId}`);
        }

        const newPlayer: Player = player;
        // sets the player status to active, there account is complete
        newPlayer.setStatus(PlayerStatus.ACTIVE);

        // create new player in database
        const response = await playerDatabase.createPlayerByOrganizationId(newPlayer, orgId);

        if (response === null) {
            return APIResponse.InternalError(`Error creating player`);
        }

        return response;
    }

    async findPlayerTeams(authId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findPlayerTeams()", {
            class: this.className,
            values: authId,
        });

        const teams = await teamDatabase.findAllTeamsByPlayerId(authId);
        return teams;
    }

    /**
     * Accepts invite for player to join team. Adds player to team roster and deletes
     * invite
     * @param playerId - id of player to send invite to
     * @param teamId - id of team sending invite
     * @returns - error response or true if success
     */
    // need to think if this performs player or team functionality
    async acceptTeamInvite(playerId: string, teamId: number): Promise<APIResponse | true> {
        logger.verbose("Entering method acceptTeamInvite()", {
            class: this.className,
            values: {
                playerId,
                teamId,
            },
        });

        // REVISIT - issues can occur here if one database method fails

        // if this invite comes back as invalid, it validates that either the team id or the player id
        // was invalid
        const inviteResponse = await playerDatabase.deletePlayerInvite(playerId, teamId);
        if (inviteResponse === null) {
            return APIResponse.NotFound(
                `No invite found with player id: ${playerId} and team id: ${teamId}`
            );
        }

        const response = await teamDatabase.addToTeamRoster(teamId, playerId, TeamRole.PLAYER);
        if (response === false) {
            return APIResponse.InternalError(`Error adding ${playerId} to team ${teamId}`);
        }

        return true;
    }

    async patchPlayer(player: Player): Promise<APIResponse | Player> {
        logger.verbose("Entering method patchPlayer()", {
            class: this.className,
            values: player,
        });

        console.log("here", player);

        const response = await playerDatabase.patchPlayer(player);
        if (response === null) {
            throw new Error(`Error patching player: ${player.getAuthId()}`);
        }

        return response;
    }

    /**
     * Sends invite for other player to join team
     * @param requestingId - id of captain or co-captain sending invite
     * @param inviteeId - id of player that is being invited
     * @param teamId - id of team player is being invited to
     * @returns - error response or true if success
     */
    // need to think if this performs player or team functionality
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
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (team.getPlayers().length >= team.getMaxTeamSize()!) {
            return APIResponse.Conflict(`Team is full`);
        }

        // check requesting id is captain
        // check that invitee isnt already on team
        // eslint-disable-next-line consistent-return
        team.getPlayers().forEach((player) => {
            if (
                player.getAuthId() === requestingId &&
                player.getRole() === (TeamRole.CAPTAIN || TeamRole.COCAPTAIN)
            ) {
                return APIResponse.Forbidden(
                    `Player ${requestingId} does not possess a valid Role to perform this action`
                );
            }
            if (player.getAuthId() === inviteeId) {
                return APIResponse.Conflict(`Player ${inviteeId} is already on team`);
            }
        });

        // add player invite to database
        // expiration date will be set to 1 week from invite.
        const date = new Date();
        date.setDate(date.getDate() + 7);

        const invite = playerDatabase.createPlayerInvite(requestingId, inviteeId, teamId, date);
        if (invite === null) {
            return APIResponse.InternalError("Error inviting player to team");
        }

        // todo: send invitee a notification of the invite

        return true;
    }

    async findOrganizationList(): Promise<APIResponse | { id: string; name: string }[]> {
        logger.verbose("Entering method findOrganizationList()", {
            class: this.className,
        });

        const orgs = await organizationDatabase.findAllOrganizations();

        if (orgs.length === 0) {
            return APIResponse.NotFound("No organizations found");
        }

        return orgs.map((organization) => {
            return {
                name: organization.getName(),
                id: organization.getId(),
            };
        });
    }

    // async joinBracket(
    //     bracketId: number,
    //     teamId: number,
    //     playerId: string
    // ): Promise<APIResponse | boolean> {
    //     logger.verbose("Entering method joinBracket()", {
    //         class: this.className,
    //         values: { bracketId, teamId, playerId },
    //     });

    //     // todo: check if bracket exists in organization
    //     const bracket = await competitionDatabase.findBracketId(bracketId);
    //     if (bracket === null) {
    //         return APIResponse.NotFound(`No bracket found with id: ${bracketId}`);
    //     }

    //     const players = await playerDatabase.findPlayersByTeamId(teamId);
    //     if (players === null || players.length === 0) {
    //         return APIResponse.NotFound(`No team found with id: ${teamId}`);
    //     }

    //     if (
    //         !players.find(
    //             (player) => player.getAuthId() === playerId && player.getRole() === Role.CAPTAIN
    //         )
    //     ) {
    //         return APIResponse[403](`Id: ${playerId} not authorized`);
    //     }

    //     // get division id to set the max team size
    //     const response = await teamDatabase.patchTeam(new Team({
    //         id: teamId,
    //         dateCreated: null,
    //         bracketId,
    //         image: "",
    //         losses: null,
    //         maxTeamSize: bracket,
    //     }))
    // }
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
    // console.log(await test.kickPlayerFromTeam("player4", 12, "player2"));
    // console.log(await test.joinTeam("player1", 10));
    // performance.mark("end");
    // performance.measure("example", "start", "end");
}
// const profile = tempLogger.startTimer();
