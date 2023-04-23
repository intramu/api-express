import AdminDAO from "../../data/adminDAO";
import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import { AdminWithPassword } from "../../interfaces/IAdmin";
import { OrganizationWithAdmin } from "../../interfaces/IOrganization";
import { Admin } from "../../models/Admin";
import { APIResponse } from "../../models/APIResponse";
import { Organization } from "../../models/Organization";
import logger from "../../utilities/winstonConfig";
import { createAdminAuth0Account } from "../commonBusinessService";

const organizationDatabase = new OrganizationDAO();
const adminDatabase = new AdminDAO();
const playerDatabase = new PlayerDAO();

export class OrganizationBusinessService {
    // classname for logger
    private readonly className = this.constructor.name;

    /**
     * Creates new organization with admin auth0 account
     * @param organization - organization to be added
     * @param admin - master admin to be added under organization
     * @returns - error response or organization and admin object
     */
    async createOrganizationWithAuth0Account(
        organization: Organization,
        admin: Admin
    ): Promise<APIResponse | OrganizationWithAdmin> {
        logger.verbose("Entering method createOrganizationWithAuth0Account()", {
            class: this.className,
            values: { organization, admin },
        });

        // create admin account in auth0
        const auth0Admin = await createAdminAuth0Account(admin, organization.getName(), true);
        if (!auth0Admin) {
            return APIResponse.InternalError("Auth0 error");
        }

        // create admin and organization in database
        const response = await organizationDatabase.createOrganization(organization, auth0Admin);

        // return the organization and admin with password
        return {
            admin: { ...response.admin, password: auth0Admin.password },
            organization: { ...response.organization },
        } as OrganizationWithAdmin;
        // typescript gets mad here unless I put this 'as' after the return
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

        // does admin exists
        const lookupAdmin = await adminDatabase.findAdminById(admin.getAuthId());
        if (lookupAdmin) {
            return APIResponse.Conflict(`Admin: ${admin.getAuthId()} already exists`);
        }

        // creates organization and master admin
        return organizationDatabase.createOrganization(organization, admin);
    }

    /**
     * Finds organization details using id
     * @param orgId - id of organization to search with
     * @returns - error response or organization object
     */
    async findOrganizationById(orgId: string): Promise<APIResponse | Organization> {
        logger.verbose("Entering method findOrganizationById()", {
            class: this.className,
            values: { orgId },
        });

        // find organization in database
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (!organization) {
            return APIResponse.NotFound(`No organization found with id ${orgId}`);
        }

        return organization;
    }

    /**
     * Finds all existing organizations in application
     * @returns - organization list
     */
    async findAllOrganizations(): Promise<APIResponse | Organization[]> {
        logger.verbose("Entering method findAllOrganizations()", {
            class: this.className,
        });

        // return list of all organizations
        return organizationDatabase.findAllOrganizations();
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

        // does organization exist
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (!organization) {
            return APIResponse.NotFound(`No organization found with id ${orgId}`);
        }

        // return fetched admins
        return adminDatabase.findAllAdminsByOrganizationId(orgId);
    }

    /**
     * Finds all admins in application
     * @returns - admin list
     */
    async findAllAdmins(): Promise<APIResponse | Admin[]> {
        logger.verbose("Entering method findAllAdmins()", {
            class: this.className,
        });

        // return all fetched admins
        return adminDatabase.findAllAdmins();
    }

    /**
     * Finds admin by id
     * @param adminId - admin id to search for
     * @returns - admin with given id
     */
    async findAdminbyId(adminId: string): Promise<APIResponse | Admin> {
        logger.verbose("Entering method findAdminById()", {
            class: this.className,
            values: { adminId },
        });

        // fetch admin by id
        const admin = await adminDatabase.findAdminById(adminId);
        if (!admin) {
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        // return the admin
        return admin;
    }

    /**
     * Remove admin from database
     * @param adminId - admin id to remove
     * @returns -
     */
    async removeAdminById(adminId: string): Promise<void> {
        logger.verbose("Entering method removeAdminById()", {
            class: this.className,
            values: { adminId },
        });
        // apparently standard says I don't have to do this
        // if (response === null) {
        //     return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        // }

        // remove admin
        await adminDatabase.removeAdminById(adminId);
    }

    /**
     * Creates new admin under organization
     * @param admin - admin to be added
     * @param orgId - organization id to place admin under
     * @returns - the saved admin
     */
    async createAdminByOrganizationId(admin: Admin, orgId: string): Promise<APIResponse | Admin> {
        logger.verbose("Entering method createAdminByOrganizationId()", {
            class: this.className,
            values: { admin, orgId },
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (!organization) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        // create admin under organization
        return adminDatabase.createAdminByOrganizationId(admin, orgId);
    }

    async createAdminByOrganizationIdWithAuth0Account(
        admin: Admin,
        orgId: string
    ): Promise<APIResponse | AdminWithPassword> {
        logger.verbose("Entering method createAdminByOrganizationIdWithAuth0Account()", {
            class: this.className,
            values: { admin, orgId },
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationById(orgId);
        if (!organization) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        const auth0Admin = await createAdminAuth0Account(admin, organization.getName(), false);
        if (!auth0Admin) {
            return APIResponse.InternalError("Auth0 error");
        }

        // create admin under organization
        const newAdmin = await adminDatabase.createAdminByOrganizationId(auth0Admin, orgId);
        return { ...newAdmin, password: auth0Admin.password } as AdminWithPassword;
    }

    /**
     * Updates organization in database
     * @param organization - organization object being updated
     * @returns - the updated organization
     */
    async updateOrganization(organization: Organization): Promise<APIResponse | Organization> {
        logger.verbose("Entering method patchOrganization()", {
            class: this.className,
            values: { organization },
        });

        // does organization exist yet
        const lookupOrg = await organizationDatabase.findOrganizationById(organization.getId());
        if (!lookupOrg) {
            return APIResponse.NotFound(`No organization found with id:${organization.getId()}`);
        }

        // update organization
        return organizationDatabase.updateOrganization(organization);
    }
}
