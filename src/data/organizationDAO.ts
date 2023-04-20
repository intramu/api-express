import { IAdminDatabase } from "../interfaces/IAdmin";
import {
    IOrganizationDatabase,
    IOrganizationWithAdmin,
    IOrganizationWithAdminDatabase,
} from "../interfaces/IOrganization";
import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";

export default class OrganizationDAO {
    private readonly className = this.constructor.name;

    /**
     * Returns organization details using id
     * @param orgId - id to search for organization with
     * @returns - Organization object or null
     */
    async findOrganizationById(orgId: string): Promise<Organization | null> {
        logger.verbose("Entering method findOrganizationById()", {
            class: this.className,
            values: orgId,
        });

        const sqlSelect = "SELECT * FROM organization WHERE id=$1";

        return withClient(async (querier) => {
            const [organization] = (await querier<IOrganizationDatabase>(sqlSelect, [orgId])).rows;

            if (organization === undefined) {
                return null;
            }

            return Organization.fromDatabase(organization);
        });
    }

    /**
     * Completely replaces all info with new organization details
     * @param org - organization details to update with
     * @returns - newly updated organization
     */
    async updateOrganization(org: Organization): Promise<Organization> {
        logger.verbose("Entering method updateOrganization()", {
            class: this.className,
            values: org,
        });

        const sqlUpdate =
            "UPDATE organization SET name=$1, image=$2, info=$3, main_color=$4, approval_status=$5 WHERE id=$6";

        return withClient(async (querier) => {
            const [organization] = (
                await querier<IOrganizationDatabase>(sqlUpdate, [
                    org.getName(),
                    org.getImage(),
                    org.getInfo(),
                    org.getMainColor(),
                    org.getApprovalStatus(),
                ])
            ).rows;

            if (organization === undefined) {
                logger.error("Error updating organization", {
                    class: this.className,
                });
                throw new Error("Error updating organization");
            }

            return Organization.fromDatabase(organization);
        });
    }

    /**
     * Returns list of all organizations in database
     * @returns - list of organizations
     */
    async findAllOrganizations(): Promise<Organization[]> {
        logger.verbose("Entering method findAllOrganizations()", {
            class: this.className,
        });

        const sqlSelect = "SELECT * FROM organization";

        return withClient(async (querier) => {
            const results = (await querier<IOrganizationDatabase>(sqlSelect)).rows;

            return results.map((organization) => Organization.fromDatabase(organization));
        });
    }

    async findOrganizationList(): Promise<{ id: string; name: string }[]> {
        logger.verbose("Entering method findOrganizationList()", {
            class: this.className,
        });

        const sqlSelect = "SELECT id, name FROM organization";

        return withClient(async (querier) => {
            const results = (await querier<IOrganizationDatabase>(sqlSelect)).rows;

            return results.map((organization) => {
                return {
                    name: organization.name,
                    id: organization.id,
                };
            });
        });
    }

    /**
     * Creates new organization and Master Admin
     *
     * @param organization - details for organization
     * @param admin - details of Master Admin for organization
     * @returns - Returns organization details if successful
     */
    // TODO: create proper return type
    async createOrganization(
        org: Organization,
        admin: Admin
    ): Promise<IOrganizationWithAdminDatabase> {
        logger.verbose("Entering method createOrganization()", {
            class: this.className,
            values: org,
        });

        // todo: write this into one query
        const sqlCreate =
            "INSERT INTO organization (name, image, info, main_color, approval_status) VALUES ($1, $2, $3, $4, $5)";

        const sqlAddAdmin =
            "INSERT INTO admin (auth_id, first_name, last_name, language, email_address, role, status, organization_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)";

        const result = await withClientRollback(async (querier) => {
            // organization is first created
            const [organization] = (
                await querier<IOrganizationDatabase>(sqlCreate, [
                    org.getName(),
                    org.getImage(),
                    org.getInfo(),
                    org.getMainColor(),
                    org.getApprovalStatus(),
                ])
            ).rows;

            if (organization === undefined) {
                return IsRollback;
            }

            // next master admin is created with previously created organization id
            const [administrator] = (
                await querier<IAdminDatabase>(sqlAddAdmin, [
                    admin.getAuthId(),
                    admin.getFirstName(),
                    admin.getLastName(),
                    admin.getLanguage,
                    admin.getEmailAddress(),
                    admin.getRole(),
                    admin.getStatus(),
                    organization.id,
                ])
            ).rows;

            if (administrator === undefined) {
                return IsRollback;
            }

            // if any error occur transaction is rolled back to prevent admin-less organizations
            const responseObject = {
                admin: Admin.fromDatabase(administrator),
                organization: Organization.fromDatabase(organization),
            };
            return responseObject;
        });

        if (result === IsRollback) {
            throw new Error("Error creating organization with admin");
        }

        return result;
    }

    /**
     * Returns organization details by searching with admin id
     * @param adminId - id of admin to search for organization with
     * @returns - organization object or null
     */
    async findOrganizationByAdminId(adminId: string): Promise<Organization | null> {
        logger.verbose("Entering method findOrganizationByAdminId()", {
            class: this.className,
        });

        const sqlFind =
            "SELECT organization.id, organization.name, organization.image, organization.info, organization.main_color, organization.approval_status, organization.date_created FROM admin INNER JOIN organization ON organization.id = admin.organization_id WHERE auth_id = $1";

        return withClient(async (querier) => {
            const [response] = (await querier<IOrganizationDatabase>(sqlFind, [adminId])).rows;

            if (response === undefined) {
                return null;
            }

            return Organization.fromDatabase(response);
        });
    }

    /**
     * Returns organization details by searching with admin id
     * @param playerId - id of player to search for organization with
     * @returns - organization object or null
     */
    async findOrganizationByPlayerId(playerId: string): Promise<Organization | null> {
        logger.verbose("Entering method findOrganizationByPlayerId()", {
            class: this.className,
        });

        const sqlSelect =
            "SELECT organization.id, organization.name, organization.image, organization.info, organization.main_color, organization.approval_status, organization.date_created FROM player INNER JOIN organization ON organization.id = player.organization_id WHERE auth_id = $1";

        return withClient(async (querier) => {
            const [response] = (await querier<IOrganizationDatabase>(sqlSelect, [playerId])).rows;

            if (response === undefined) {
                return null;
            }

            return Organization.fromDatabase(response);
        });
    }

    // Probably don't need delete method until much later. There should be other alternatives rather
    // then completely deleting the organization. Will have to orchestrate what gets deleted.
}
const test = new OrganizationDAO();

async function asyncFunc() {
    // console.log(await test.findAllOrganizations());
    // await test.findOrganizationByAdminId("test1");
}

asyncFunc();
