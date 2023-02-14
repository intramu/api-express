import AdminDAO from "../../data/adminDAO";
import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import { AdminNew } from "../../interfaces/Admin";
import { OrganizationWithAdmin } from "../../interfaces/Organization";
import { Admin } from "../../models/Admin";
import { APIResponse } from "../../models/APIResponse";
import { Organization } from "../../models/Organization";
import { Player } from "../../models/Player";
import { AdminRole, AdminStatus, PlayerStatus } from "../../utilities/enums/userEnum";
import { auth0 } from "../../utilities/ManagementApiTokenGen";
import logger from "../../utilities/winstonConfig";

const organizationDatabase = new OrganizationDAO();
// const competitionDatabase = new CompetitionDAO();
const adminDatabase = new AdminDAO();
const playerDatabase = new PlayerDAO();
// const teamDatabase = new TeamDAO();

export class OrganizationBusinessService {
    private readonly className = this.constructor.name;

    // todo: fetch dynamically
    private readonly masterAdminRoleId = "rol_9NXcdxNXlOxsujpF";

    private readonly playerRoleId = "rol_BToL9pB5B7MmO2hU";

    /** SUDO SCOPED - these methods will only be used by sudo users in the service API */

    /**
     * Creates new organization with admin auth0 account
     * @param organization - organization to be added
     * @param admin - master admin to be added under organization
     * @returns - error response or password of master admin
     */
    async createOrganizationWithAuth0Account(
        organization: Organization,
        admin: AdminNew
    ): Promise<APIResponse | string> {
        logger.verbose("Entering method createOrganizationWithAuth0Account()", {
            class: this.className,
            values: {
                organization,
                admin,
            },
        });

        // admin is first created in auth0
        const newAuthUser = {
            // todo: be able to change blocked, verify_email, and email_verified values
            email: admin.emailAddress,
            user_metadata: {
                profile_completion_status: "complete",
            },
            blocked: false,
            email_verified: false,
            given_name: admin.firstName || `${organization.getName()} Master Administrator`,
            family_name: admin.lastName || "",
            name: `${admin.firstName} ${admin.lastName}`,
            connection: "Username-Password-Authentication",
            password: Math.random().toString(36).slice(-8).concat("1111!"),
            verify_email: true,
        };

        // creates new user in auth0
        const create = await auth0.createUser(newAuthUser);
        if (create.user_id === undefined) {
            return APIResponse[500]("Auth0 error creating user");
        }

        // assigns the master admin role to the created user
        const auth = auth0
            .assignRolestoUser({ id: create.user_id }, { roles: [this.masterAdminRoleId] })
            .catch((err) => {
                logger.error("Error assigning role to user auth0", {
                    class: this.className,
                    trace: err,
                });
                return null;
            });

        if (auth === null) {
            return APIResponse[500]("Auth0 error assigning role to user");
        }

        // default values for this query give the admin a generic name if once isn't provided
        // role is automatically set to MASTER for the first admin
        // status is set to active
        const newAdmin: Admin = new Admin({
            authId: create.user_id,
            firstName: admin.firstName || `${organization.getName()} Master Administrator`,
            lastName: admin.lastName || "",
            language: admin.language,
            emailAddress: admin.emailAddress,
            role: AdminRole.MASTER,
            dateCreated: null,
            status: AdminStatus.ACTIVE,
            // organizationId: "",
        });

        const response = await organizationDatabase.createOrganization(organization, newAdmin);
        if (response === null) {
            return APIResponse[500]("Error creating organization");
        }

        logger.debug(
            `new admin created with temp password: ${
                newAuthUser.password
            } for organization: ${response.organization.getId()}`
        );

        // return the password of the just created admin
        return newAuthUser.password;
    }

    /**
     * Creates organization without creating admin auth0 account. This is used for testing
     * @param org - organization to be added
     * @param admin - master admin to be added under organization
     * @returns - error response or both the organization and admin details
     */
    async createOrganization(
        org: Organization,
        admin: Admin
    ): Promise<APIResponse | OrganizationWithAdmin> {
        logger.verbose("Entering method createOrganization()", {
            class: this.className,
            values: org,
        });

        // this method creates both the organization and master admin in a transaction
        const orgWithAdmin = await organizationDatabase.createOrganization(org, admin);
        if (orgWithAdmin === null) {
            return APIResponse[500](`Error creating organization`);
        }

        return orgWithAdmin;
    }

    /**
     * Finds organization details using id
     * @param orgId - id of organization to search with
     * @returns - error response or organization object
     */
    async findOrganizationById(orgId: string): Promise<APIResponse | Organization> {
        logger.verbose("Entering method findOrganizationById()", {
            class: this.className,
            values: orgId,
        });

        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (organization === null) {
            return APIResponse[404](`No organization found with id ${orgId}`);
        }

        return organization;
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

    /**
     * Finds all existing organizations in application
     * @returns - error response or list of organizations
     */
    async findAllOrganizations(): Promise<APIResponse | Organization[]> {
        logger.verbose("Entering method findOrganizations()", {
            class: this.className,
        });

        const organizations = await organizationDatabase.findAllOrganizations();
        if (organizations.length === 0) {
            return APIResponse[404](`No organizations found`);
        }

        return organizations;
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
     * Patches player in database with new details.
     * @param player - player details to be patched in database
     * @returns - error response or newly updated player object
     */
    async patchPlayer(player: Player): Promise<APIResponse | Player> {
        logger.verbose("Entering method patchPlayer()", {
            class: this.className,
            values: player,
        });

        const check = await playerDatabase.findPlayerById(player.getAuthId());
        if (check === null) {
            return APIResponse[404](`No player found with auth id: ${player.getAuthId()}`);
        }
        const response = await playerDatabase.patchPlayer(player);
        if (response === null) {
            return APIResponse[500](`Error patching player`);
        }

        return response;
    }

    /**
     * Finds all admins in organization using organization id
     * @param orgId - id of organization
     * @returns - error response or list of admins
     */
    async findAllAdminsByOrganizationId(orgId: string): Promise<APIResponse | Admin[]> {
        logger.verbose("Entering method findAllAdminsByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (organization === null) {
            return APIResponse[404](`No organization found with id ${orgId}`);
        }

        const admins = await adminDatabase.findAllAdminsByOrganizationId(orgId);
        if (admins.length === 0) {
            return APIResponse[404](`No admins found with organization id: ${orgId}`);
        }

        return admins;
    }
}
