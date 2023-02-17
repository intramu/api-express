import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import { APIResponse } from "../../models/APIResponse";
import { Player } from "../../models/Player";
import { auth0 } from "../../utilities/ManagementApiTokenGen";
import logger from "../../utilities/winstonConfig";

const playerDatabase = new PlayerDAO();
const organizationDatabase = new OrganizationDAO();

export class PlayerBusinessService {
    private readonly className = this.constructor.name;

    private readonly playerRoleId = "rol_BToL9pB5B7MmO2hU";

    async findAllPlayers(): Promise<Player[]> {
        logger.verbose("Entering method findAllPlayers()", {
            class: this.className,
        });

        const players = await playerDatabase.findAllPlayers();
        return players;
    }

    async findPlayerById(playerId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
            values: playerId,
        });

        const player = await playerDatabase.findPlayerById(playerId);
        if (player === null) {
            return APIResponse[404](`No player found with id: ${playerId}`);
        }

        return player;
    }

    async removePlayerById(playerId: string): Promise<APIResponse | boolean> {
        logger.verbose("Entering method removePlayerById()", {
            class: this.className,
            values: playerId,
        });

        const response = await playerDatabase.deletePlayerById(playerId);
        // const response = true;
        if (response === false) {
            return APIResponse[404](`No player found with id: ${playerId}`);
        }

        return true;
    }

    async patchPlayer(player: Player): Promise<APIResponse | Player> {
        logger.verbose("Entering method patchPlayer()", {
            class: this.className,
            values: player,
        });

        // REVISIT
        // const findPlayer = await playerDatabase.findPlayerById()
        const response = await playerDatabase.patchPlayer(player);
        if (response === null) {
            return APIResponse[500]("Not sure");
        }

        return response;
    }

    //     /**
    //  * Patches player in database with new details.
    //  * @param player - player details to be patched in database
    //  * @returns - error response or newly updated player object
    //  */
    //     async patchPlayer(player: Player): Promise<APIResponse | Player> {
    //         logger.verbose("Entering method patchPlayer()", {
    //             class: this.className,
    //             values: player,
    //         });

    //         const check = await playerDatabase.findPlayerById(player.getAuthId());
    //         if (check === null) {
    //             return APIResponse[404](`No player found with auth id: ${player.getAuthId()}`);
    //         }
    //         const response = await playerDatabase.patchPlayer(player);
    //         if (response === null) {
    //             return APIResponse[500](`Error patching player`);
    //         }

    //         return response;
    //     }

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

        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (organization === null) {
            return APIResponse[404](`No Organization found with id: ${orgId}`);
        }

        const response = await playerDatabase.createPlayerByOrganizationId(player, orgId);
        if (response === null) {
            return APIResponse[500](`Error creating player`);
        }

        return player;
    }

    // REVISIT - may need to be moved to other business service
    /**
     * Creates new player in organization with auth0 account
     *
     * @param player object to be added
     * @param orgId organization id which the player is added under
     * @returns - todo: return interface or union type. Should return player object with password attached.
     */
    async createPlayerWithAuth0Account(
        player: Player,
        orgId: string
    ): Promise<APIResponse | string> {
        logger.verbose("Entering method createPlayerWithAuth0Account()", {
            class: this.className,
            values: { player, orgId },
        });

        // check if organization exists
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (organization === null) {
            return APIResponse[404](`No Organization found with id: ${orgId}`);
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

        // new player is created in database under organization
        const databaseResponse = await playerDatabase.createPlayerByOrganizationId(
            newPlayer,
            orgId
        );

        if (databaseResponse === null) {
            logger.error("Could not add user to database", {
                class: this.className,
                values: newPlayer,
            });

            return APIResponse[500]("Error creating player");
        }

        // returns new users password
        return newAuthUser.password;
    }

    /**
     * Finds all players under organization using id
     * @param orgId - id of organization to search with
     * @returns - error response or organization object
     */
    async findAllPlayersByOrganizationId(orgId: string): Promise<APIResponse | Player[]> {
        logger.verbose("Entering method findAllPlayersByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (organization === null) {
            return APIResponse[404](`No organization found with id: ${orgId}`);
        }

        const players = await playerDatabase.findAllPlayersByOrganizationId(orgId);
        if (players === null) {
            return APIResponse[404](`No players found with organization id: ${orgId}`);
        }

        return players;
    }
}
