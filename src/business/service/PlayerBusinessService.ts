import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import { APIResponse } from "../../models/APIResponse";
import { Player } from "../../models/Player";
import { auth0, generateRandomPasword } from "../../utilities/authUtilities";
import logger from "../../utilities/winstonConfig";

const playerDatabase = new PlayerDAO();
const organizationDatabase = new OrganizationDAO();

export class PlayerBusinessService {
    // classname for logger
    private readonly className = this.constructor.name;

    // from auth0 role list; applied to all players
    private readonly playerRoleId = "rol_BToL9pB5B7MmO2hU";

    /**
     * Creates player auth0 account with provided details
     * @param player - player object
     * @returns - created player with password
     */
    private async createPlayerAuth0Account(
        player: Player
    ): Promise<(Player & { password: string }) | null> {
        // generate random password for new account
        const randomPassword = generateRandomPasword;

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
            password: randomPassword,
            verify_email: true,
        };

        // create user in auth0
        const auth0Player = await auth0.createUser(newAuthUser);
        if (!auth0Player.user_id) {
            logger.error("Auth0 error creating user", {
                class: this.className,
                values: { newAuthUser, randomPassword },
            });
            return null;
        }

        // assign the role player to new user
        auth0
            .assignRolestoUser({ id: auth0Player.user_id }, { roles: [this.playerRoleId] })
            .catch((err) => {
                logger.error("Error adding role to Auth0 user", {
                    class: this.className,
                    values: { auth0Player },
                    trace: err,
                });
            });

        // create new player and assign it the authid
        const newPlayer = new Player({
            ...player,
            authId: auth0Player.user_id,
        });

        return { ...newPlayer, password: randomPassword } as Player & { password: string };
    }

    /**
     * Finds all players in application
     * @returns - player list
     */
    async findAllPlayers(): Promise<Player[]> {
        logger.verbose("Entering method findAllPlayers()", {
            class: this.className,
        });

        // fetches all players
        return playerDatabase.findAllPlayers();
    }

    /**
     * Finds player by id
     * @param playerId - given id to search with
     * @returns - error response or the player
     */
    async findPlayerById(playerId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
            values: { playerId },
        });

        // find player in database
        const player = await playerDatabase.findPlayerById(playerId);
        if (!player) {
            return APIResponse.NotFound(`No player found with id: ${playerId}`);
        }

        return player;
    }

    /**
     * Removes player from database with id
     * @param playerId - given id to delete with
     * @returns - void
     */
    async removePlayerById(playerId: string): Promise<void> {
        logger.verbose("Entering method removePlayerById()", {
            class: this.className,
            values: { playerId },
        });

        // delete player
        return playerDatabase.deletePlayerById(playerId);
        // if (response === false) {
        //     return APIResponse.NotFound(`No player found with id: ${playerId}`);
        // }
    }

    /**
     * Patches player with new details
     * @param player - player object to patch with
     * @returns - error response or the patched player
     */
    async patchPlayer(player: Player): Promise<APIResponse | Player> {
        logger.verbose("Entering method patchPlayer()", {
            class: this.className,
            values: { player },
        });

        // does player exist
        const lookup = await playerDatabase.findPlayerById(player.getAuthId());
        if (!lookup) {
            return APIResponse.NewNotFound(player.getAuthId());
        }

        // patch player
        return playerDatabase.patchPlayer(player);
    }

    /**
     * Creates new player in organization without auth0 account. Used for testing
     * @param player - player object to be added
     * @param orgId - id organization player will be under
     * @returns - error response or player object
     */
    async createPlayerByOrganizationId(
        player: Player,
        orgId: string
    ): Promise<APIResponse | Player> {
        logger.verbose("Entering method createPlayerByOrganizationId()", {
            class: this.className,
            values: { player, orgId },
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (!organization) {
            return APIResponse.NotFound(`No Organization found with id: ${orgId}`);
        }

        // create player
        return playerDatabase.createPlayerByOrganizationId(player, orgId);
    }

    /**
     * Creates new player in organization with auth0 account
     * @param player object to be added
     * @param orgId organization id which the player is added under
     * @returns - todo: return interface or union type. Should return player object with password attached.
     */
    async createPlayerWithAuth0Account(
        player: Player,
        orgId: string
    ): Promise<APIResponse | (Player & { password: string })> {
        logger.verbose("Entering method createPlayerWithAuth0Account()", {
            class: this.className,
            values: { player, orgId },
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (!organization) {
            return APIResponse.NotFound(`No Organization found with id: ${orgId}`);
        }

        // create player account in auth0
        const auth0Player = await this.createPlayerAuth0Account(player);
        if (!auth0Player) {
            return APIResponse.InternalError("Auth0 error");
        }

        // new player is created in database under organization
        const response = await playerDatabase.createPlayerByOrganizationId(auth0Player, orgId);

        // returns new player with temp password
        return { ...response, password: auth0Player.password } as Player & { password: string };
    }

    /**
     * Finds all players under organization using id
     * @param orgId - id of organization to search with
     * @returns - error response or player list
     */
    async findAllPlayersByOrganizationId(orgId: string): Promise<APIResponse | Player[]> {
        logger.verbose("Entering method findAllPlayersByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (organization === null) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        // return player list
        return playerDatabase.findAllPlayersByOrganizationId(orgId);
    }
}
