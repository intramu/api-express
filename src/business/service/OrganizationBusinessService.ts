import AdminDAO from "../../data/adminDAO";
import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import { IOrganizationWithAdmin } from "../../interfaces/IOrganization";
import { Admin } from "../../models/Admin";
import { APIResponse } from "../../models/APIResponse";
import { Organization } from "../../models/Organization";
import { Player } from "../../models/Player";
import { AdminRole, AdminStatus } from "../../utilities/enums/userEnum";
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

    /** SUDO SCOPED - these methods will only be used by sudo users in the service API */

    /**
     * Creates new organization with admin auth0 account
     * @param organization - organization to be added
     * @param admin - master admin to be added under organization
     * @returns - error response or password of master admin
     */
    async createOrganizationWithAuth0Account(
        organization: Organization,
        admin: Admin
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
            email: admin.getEmailAddress(),
            user_metadata: {
                profile_completion_status: "complete",
            },
            blocked: false,
            email_verified: false,
            given_name: admin.getFirstName() || `${organization.getName()} Master Administrator`,
            family_name: admin.getLastName() || "",
            name: `${admin.getFirstName()} ${admin.getLastName()}`,
            connection: "Username-Password-Authentication",
            password: Math.random().toString(36).slice(-8).concat("1111!"),
            verify_email: true,
        };

        // creates new user in auth0
        const create = await auth0.createUser(newAuthUser);
        if (create.user_id === undefined) {
            return APIResponse.InternalError("Auth0 error creating user");
        }

        // assigns the master admin role in auth0, to the created user
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
            return APIResponse.InternalError("Auth0 error assigning role to user");
        }

        // default values for this query give the admin a generic name if once isn't provided
        // role is automatically set to MASTER for the first admin
        // status is set to active
        const newAdmin: Admin = new Admin({
            authId: create.user_id,
            firstName: admin.getFirstName() || `${organization.getName()} Master Administrator`,
            lastName: admin.getLastName() || "",
            language: admin.getLanguage(),
            emailAddress: admin.getEmailAddress(),
            role: AdminRole.MASTER,
            dateCreated: null,
            status: AdminStatus.ACTIVE,
            // organizationId: "",
        });

        const response = await organizationDatabase.createOrganization(organization, newAdmin);

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
     * @param organization - organization to be added
     * @param admin - master admin to be added under organization
     * @returns - error response or both the organization and admin details
     */
    async createOrganization(
        organization: Organization,
        admin: Admin
    ): Promise<APIResponse | Object> {
        logger.verbose("Entering method createOrganization()", {
            class: this.className,
            values: { organization, admin },
        });

        const lookupAdmin = await adminDatabase.findAdminById(admin.getAuthId());
        if (lookupAdmin) {
            return APIResponse.Conflict(`Admin: ${admin.getAuthId()} already exists`);
        }

        // this method creates both the organization and master admin in a transaction
        const orgWithAdmin = await organizationDatabase.createOrganization(organization, admin);
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
            return APIResponse.NotFound(`No organization found with id ${orgId}`);
        }

        return organization;
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
        return organizations;
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

        // if organization exists
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (organization === null) {
            return APIResponse.NotFound(`No organization found with id ${orgId}`);
        }

        // get admins
        const admins = await adminDatabase.findAllAdminsByOrganizationId(orgId);

        return admins;
    }

    async findAllAdmins(): Promise<APIResponse | Admin[]> {
        logger.verbose("Entering method findAllAdmins()", {
            class: this.className,
        });

        const admins = adminDatabase.findAllAdmins();
        return admins;
    }

    async findAdminbyId(adminId: string): Promise<APIResponse | Admin> {
        logger.verbose("Entering method findAdminById()", {
            class: this.className,
            values: { adminId },
        });

        const admin = await adminDatabase.findAdminById(adminId);
        if (admin === null) {
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        return admin;
    }

    async removeAdminById(adminId: string): Promise<APIResponse | boolean> {
        logger.verbose("Entering method removeAdminById()", {
            class: this.className,
            values: { adminId },
        });

        const response = await adminDatabase.removeAdminById(adminId);
        if (response === null) {
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        return true;
    }

    async createAdminByOrganizationId(admin: Admin, orgId: string): Promise<APIResponse | Admin> {
        logger.verbose("Entering method createAdminByOrganizationId()", {
            class: this.className,
            values: { admin, orgId },
        });

        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (organization === null) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        return await adminDatabase.createAdminByOrganizationId(admin, orgId);
    }

    async updateOrganization(organization: Organization): Promise<APIResponse | Organization> {
        logger.verbose("Entering method patchOrganization()", {
            class: this.className,
            values: { organization },
        });

        const lookupOrg = await organizationDatabase.findOrganizationById(organization.getId());
        if (lookupOrg === null) {
            return APIResponse.NotFound(`No organization found with id:${organization.getId()}`);
        }

        return await organizationDatabase.updateOrganization(organization);
    }
}
