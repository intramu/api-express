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
    // classname for logger
    readonly className = this.constructor.name;

    /**
     * Searches for other player using playerId
     * @param authId - user requesting for other player details
     * @param playerId - id of player being searched for
     * @returns - error response or player with given id
     */
    // TODO: needs rework
    async findPlayerById(authId: string, playerId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
            values: { playerId, authId },
        });

        // TODO: visibility levels return different amounts of information

        // finds both players organizations
        const playerResponse = await organizationDatabase.findOrganizationByPlayerId(playerId);
        const authResponse = await organizationDatabase.findOrganizationByPlayerId(authId);

        // do they exist
        if (!playerResponse || !authResponse) {
            return APIResponse.NewNotFound(playerId);
        }

        // do both players belong to same organization
        if (playerResponse.getId() !== authResponse.getId()) {
            return APIResponse.NewNotFound(playerId);
        }

        // finds player info in database. Cannot possibly be null here
        const player = await playerDatabase.findPlayerById(playerId);

        // is player visibility closed
        if (player!.getVisibility() === PlayerVisibility.CLOSED) {
            return APIResponse.Conflict(`Player visibility is ${player!.getVisibility()}`);
        }

        return player!;
    }

    /**
     * Finds requesting players profile details by using Id
     * @param authId of requesting player
     * @returns error response or player with given id
     */
    // TODO: needs rework
    async findPlayerProfile(authId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method findPlayerProfile()", {
            class: this.className,
            values: authId,
        });

        // does player exist
        const player = await playerDatabase.findPlayerById(authId);
        if (!player) {
            return APIResponse.NotFound(`No player found with id: ${authId}`);
        }

        return player;
    }

    /**
     * Creates new player account. This finishes their profile by adding details
     * to internal database.
     * @param player - player details to be added
     * @param orgId - id of organization to add player too
     * @returns - error response or the saved player
     */
    async createPlayer(player: Player, orgId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method createPlayer()", {
            class: this.className,
            values: { player, orgId },
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (!organization) {
            return APIResponse.NotFound(`No Organization found with id: ${orgId}`);
        }

        // sets the player status to active, there account is complete
        const newPlayer = new Player({ ...player, status: PlayerStatus.ACTIVE });

        // create new player in database
        return playerDatabase.createPlayerByOrganizationId(newPlayer, orgId);
    }

    /**
     * Returns all teams for player
     * @param authId - id to search with
     * @returns - error response or team list
     */
    async findPlayersTeams(authId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findPlayerTeams()", {
            class: this.className,
            values: { authId },
        });

        // fetches teams from database
        return teamDatabase.findAllTeamsByPlayerId(authId);
    }

    /**
     * Accepts invite for player to join team. Adds player to team roster and deletes
     * invite
     * @param playerId - id of player to send invite to
     * @param teamId - id of team sending invite
     * @returns - error response or true if success
     */
    async acceptTeamInvite(authorizingId: string, teamId: number): Promise<APIResponse | void> {
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

        // add player to team roster
        await teamDatabase.addToTeamRoster(teamId, authorizingId, TeamRole.PLAYER);
    }

    /**
     * Patches player by its id
     * @param player - player object that will be used to patch
     * @returns -
     */
    async patchPlayer(player: Player): Promise<APIResponse | Player> {
        logger.verbose("Entering method patchPlayer()", {
            class: this.className,
            values: player,
        });

        // does player exist
        const lookup = await playerDatabase.findPlayerById(player.getAuthId());
        if (!lookup) {
            return APIResponse.NewNotFound(player.getAuthId());
        }

        // patches player object
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

        // check team exists
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // and is valid for invite
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

    /**
     * Finds all player invites with id
     * @param authorizingId - id to search by
     * @returns - error response or player invite list
     */
    async findAllPlayerInvitesById(authorizingId: string): Promise<APIResponse | IPlayerInvite[]> {
        logger.verbose("Entering method invitePlayerToTeam()", {
            class: this.className,
            values: { authorizingId },
        });

        // does player exist
        const player = await playerDatabase.findPlayerById(authorizingId);
        if (!player) {
            return APIResponse.NewNotFound(authorizingId);
        }

        // return invites
        return playerDatabase.findAllPlayerInvites(authorizingId);
    }

    /**
     * Searches for players in organization by name
     * @param authId - id of player searching
     * @param name - name player is searching for
     * @returns - error response or player list
     */
    // REVISIT - for performance issues if necessary
    async findPlayerByNameInOrganization(
        authId: string,
        name: string
    ): Promise<APIResponse | Player[]> {
        logger.verbose("Entering method findPlayerByNameInOrganization()", {
            class: this.className,
            values: { name, authId },
        });

        // does organization exist
        const org = await organizationDatabase.findOrganizationByPlayerId(authId);
        if (!org) {
            return APIResponse.NotFound(`No organization found with id:${authId}`);
        }

        // returns player list
        return playerDatabase.findPlayerByName(name, org.getId());
    }
}
