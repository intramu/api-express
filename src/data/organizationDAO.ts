import { IAdminDatabase } from "../interfaces/IAdmin";
import { IOrganizationDatabase } from "../interfaces/IOrganization";
import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";

export default class OrganizationDAO {
    private readonly className = this.constructor.name;

    /**
     * Retrieves organization by id
     * @param orgId - must not be null
     * @returns - organization with given id or null if not found
     */
    async findOrganizationById(orgId: string): Promise<Organization | null> {
        logger.verbose("Entering method findOrganizationById()", {
            class: this.className,
            values: orgId,
        });

        const sqlSelect = "SELECT * FROM organization WHERE id=$1";

        return withClient(async (querier) => {
            const [organization] = (await querier<IOrganizationDatabase>(sqlSelect, [orgId])).rows;

            return !organization ? null : Organization.fromDatabase(organization);
        });
    }

    /**
     * Returns list of organizations with only name and id
     * @returns - organization list
     */
    async findAllOrganizationsWithNameAndId(): Promise<{ id: string; name: string }[]> {
        logger.verbose("Entering method findAllOrganizationsWithNameAndId()", {
            class: this.className,
        });

        const sqlSelect = "SELECT id, name FROM organization";

        return withClient(async (querier) => {
            const results = (await querier<IOrganizationDatabase>(sqlSelect)).rows;

            return results.map((organization) => ({
                name: organization.name,
                id: organization.id,
            }));
        });
    }

    /**
     * Retrieves organization by admin id
     * @param adminId - must not be null
     * @returns - organization with given admin id or null
     */
    async findOrganizationByAdminId(adminId: string): Promise<Organization | null> {
        logger.verbose("Entering method findOrganizationByAdminId()", {
            class: this.className,
            values: { adminId },
        });

        const sqlFind =
            "SELECT * FROM admin a JOIN organization o ON o.id = a.organization_id WHERE a.auth_id = $1";

        return withClient(async (querier) => {
            const [response] = (await querier<IOrganizationDatabase>(sqlFind, [adminId])).rows;

            return !response ? null : Organization.fromDatabase(response);
        });
    }

    async findOrganizationByTeamId(teamId: number): Promise<Organization | null> {
        logger.verbose("Entering method findOrganizationByTeamId()", {
            class: this.className,
            values: { teamId },
        });

        const sqlFind =
            "SELECT * FROM team t JOIN organization o ON o.id = t.organization_id WHERE t.id = $1";

        return withClient(async (querier) => {
            const [response] = (await querier<IOrganizationDatabase>(sqlFind, [teamId])).rows;

            return !response ? null : Organization.fromDatabase(response);
        });
    }

    /**
     * Retrieves organization by player id
     * @param adminId - must not be null
     * @returns - organization with given player id or null
     */
    async findOrganizationByPlayerId(playerId: string): Promise<Organization | null> {
        logger.verbose("Entering method findOrganizationByPlayerId()", {
            class: this.className,
        });

        const sqlSelect =
            "SELECT * FROM player p JOIN organization o ON o.id = p.organization_id WHERE p.auth_id = $1";

        return withClient(async (querier) => {
            const [response] = (await querier<IOrganizationDatabase>(sqlSelect, [playerId])).rows;

            return !response ? null : Organization.fromDatabase(response);
        });
    }

    /**
     * Updates organization by its id
     * @param organization - must not be null
     * @returns - the updated organization
     */
    async updateOrganization(organization: Organization): Promise<Organization> {
        logger.verbose("Entering method updateOrganization()", {
            class: this.className,
            values: organization,
        });

        const sqlUpdate =
            "UPDATE organization SET name=$1, image=$2, info=$3, main_color=$4, approval_status=$5 WHERE id=$6";

        return withClient(async (querier) => {
            const [response] = (
                await querier<IOrganizationDatabase>(sqlUpdate, [
                    organization.getName(),
                    organization.getImage(),
                    organization.getInfo(),
                    organization.getMainColor(),
                    organization.getApprovalStatus(),
                ])
            ).rows;

            if (!response) {
                logger.error("Error updating organization", {
                    class: this.className,
                });
                throw new Error("Error updating organization");
            }

            return Organization.fromDatabase(response);
        });
    }

    /**
     * Returns list of all organizations
     * @returns - organization list
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

    /**
     * Creates new organization and Master Admin
     * @param organization - must not be null
     * @param admin - master admin for organization; must not be null
     * @returns -
     */
    async createOrganization(
        org: Organization,
        admin: Admin
    ): Promise<{ organization: Organization; admin: Admin }> {
        logger.verbose("Entering method createOrganization()", {
            class: this.className,
            values: org,
        });

        // todo: write this into one query
        const sqlCreate =
            "INSERT INTO organization (name, image, info, main_color, approval_status, primary_contact_email, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)";

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
                    org.getPrimaryContactEmail(),
                    org.getNotes(),
                ])
            ).rows;

            if (!organization) {
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

            if (!administrator) {
                return IsRollback;
            }

            // if any error occur transaction is rolled back to prevent admin-less organizations
            return {
                admin: Admin.fromDatabase(administrator),
                organization: Organization.fromDatabase(organization),
            };
        });

        if (result === IsRollback) {
            throw new Error("Error creating organization with admin");
        }

        return result;
    }

    // Probably don't need delete method until much later. There should be other alternatives rather
    // then completely deleting the organization. Will have to orchestrate what gets deleted.
}
