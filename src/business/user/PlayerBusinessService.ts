import PlayerDAO from "../../data/playerDAO";
import { Player } from "../../models/Player";
import logger from "../../utilities/winstonConfig";
import { APIResponse } from "../../models/APIResponse";
import { PlayerStatus, PlayerVisibility } from "../../utilities/enums/userEnum";
import TeamDAO from "../../data/teamDAO";
import OrganizationDAO from "../../data/organizationDAO";
import { TeamRole } from "../../utilities/enums/teamEnum";
import { Team } from "../../models/Team";
import { IPlayerInvite } from "../../interfaces/IPlayerInvite";

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

        // TODO: visibility levels return different amounts of information
        // TODO: not separation safe
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
     * Creates new player account. This finishes their profile by adding details
     * to internal database.
     * @param player - player details to be added
     * @param orgId - id of organization to add player too
     * @returns - error response or newly created player object
     */
    async createPlayer(player: Player, orgId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method createPlayer()", {
            class: this.className,
            values: { player, orgId },
        });

        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (organization === null) {
            return APIResponse.NotFound(`No Organization found with id: ${orgId}`);
        }

        const newPlayer: Player = player;
        // sets the player status to active, there account is complete
        newPlayer.setStatus(PlayerStatus.ACTIVE);

        // create new player in database
        return playerDatabase.createPlayerByOrganizationId(newPlayer, orgId);
    }

    async findPlayersTeams(authId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findPlayerTeams()", {
            class: this.className,
            values: authId,
        });

        return teamDatabase.findAllTeamsByPlayerId(authId);
    }

    /**
     * Accepts invite for player to join team. Adds player to team roster and deletes
     * invite
     * @param playerId - id of player to send invite to
     * @param teamId - id of team sending invite
     * @returns - error response or true if success
     */
    // need to think if this performs player or team functionality
    async acceptTeamInvite(authorizingId: string, teamId: number): Promise<APIResponse | true> {
        logger.verbose("Entering method acceptTeamInvite()", {
            class: this.className,
            values: {
                authorizingId,
                teamId,
            },
        });

        // REVISIT - issues can occur here if one database method fails

        // if this invite comes back as invalid, it validates that either the team id or the player id
        // was invalid
        const inviteResponse = await playerDatabase.deletePlayerInvite(authorizingId, teamId);
        if (inviteResponse === null) {
            return APIResponse.NotFound(
                `No invite found with player id: ${authorizingId} and team id: ${teamId}`
            );
        }

        await teamDatabase.addToTeamRoster(teamId, authorizingId, TeamRole.PLAYER);
        return true;
    }

    async patchPlayer(player: Player): Promise<APIResponse | Player> {
        logger.verbose("Entering method patchPlayer()", {
            class: this.className,
            values: player,
        });

        return playerDatabase.patchPlayer(player);
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
        authorizingId: string,
        inviteeId: string,
        teamId: number
    ): Promise<APIResponse | IPlayerInvite> {
        logger.verbose("Entering method invitePlayerToTeam()", {
            class: this.className,
            values: {
                authorizingId,
                inviteeId,
                teamId,
            },
        });

        // check team exists and is valid for invite
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        if (team.getPlayers().length >= team.getMaxTeamSize()) {
            return APIResponse.Conflict(`Team is full`);
        }

        // check requesting id is captain
        // check that invitee isnt already on team
        team.getPlayers().forEach((player) => {
            if (
                player.getAuthId() === authorizingId &&
                player.getRole() === (TeamRole.CAPTAIN || TeamRole.COCAPTAIN)
            ) {
                return APIResponse.Forbidden(
                    `Player ${authorizingId} does not possess a valid Role to perform this action`
                );
            }
            if (player.getAuthId() === inviteeId) {
                return APIResponse.Conflict(`Player ${inviteeId} is already on team`);
            }
        });

        // expiration date will be set to 1 week from invite.
        const date = new Date();
        date.setDate(date.getDate() + 7);

        // add player invite to database
        return playerDatabase.createPlayerInvite(authorizingId, inviteeId, teamId, date);

        // todo: send invitee a notification of the invite
    }

    async findAllPlayerInvitesById(authorizingId: string): Promise<IPlayerInvite[]> {
        logger.verbose("Entering method invitePlayerToTeam()", {
            class: this.className,
            values: { authorizingId },
        });

        return playerDatabase.findAllPlayerInvitesById(authorizingId);
    }

    async findOrganizationList(): Promise<APIResponse | { id: string; name: string }[]> {
        logger.verbose("Entering method findOrganizationList()", {
            class: this.className,
        });

        const orgs = await organizationDatabase.findOrganizationList();

        if (orgs.length === 0) {
            return APIResponse.NotFound("No organizations found");
        }

        return orgs.map((organization) => {
            return {
                name: organization.name,
                id: organization.id,
            };
        });
    }

    async findAllPlayersInOrganizationByName(
        authId: string,
        name: string
    ): Promise<APIResponse | Player[]> {
        logger.verbose("Entering method findAllPlayersInOrganizationByName()", {
            class: this.className,
            values: { name, authId },
        });

        const org = await organizationDatabase.findOrganizationByPlayerId(authId);
        if (org === null) {
            return APIResponse.NotFound(`No organization found with id:${authId}`);
        }

        return playerDatabase.findPlayerByName(name, org.getId());
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
