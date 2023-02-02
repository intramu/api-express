import { OrganizationDatabaseInterface, OrganizationWithAdmin } from "../interfaces/Organization";
import { AdminDatabaseInterface } from "../interfaces/Admin";
import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";

export default class OrganizationDAO {
    private readonly className = this.constructor.name;

    async findOrganizationById(orgId: string): Promise<Organization | null> {
        logger.verbose("Entering method findOrganizationById()", {
            class: this.className,
            values: orgId,
        });

        const sqlSelect = "SELECT * FROM organization WHERE id=$1";

        return withClient(async (querier) => {
            const [organization] = (
                await querier<OrganizationDatabaseInterface>(sqlSelect, [orgId])
            ).rows;

            if (organization === undefined) {
                return null;
            }

            return new Organization({
                id: organization.id,
                name: organization.name,
                image: organization.image,
                info: organization.info,
                mainColor: organization.main_color,
                approvalStatus: organization.approval_status,
                dateCreated: organization.date_created,
            });
        });
    }

    async updateOrganization(org: Organization): Promise<Organization | null> {
        logger.verbose("Entering method updateOrganization()", {
            class: this.className,
            values: org,
        });

        const sqlUpdate =
            "UPDATE organization SET name=$1, image=$2, info=$3, main_color=$4, approval_status=$5 WHERE id=$6";

        return withClient(async (querier) => {
            const [organization] = (
                await querier(sqlUpdate, [
                    org.getName(),
                    org.getImage(),
                    org.getInfo(),
                    org.getMainColor(),
                    org.getApprovalStatus(),
                ])
            ).rows;

            if (organization === undefined) {
                return null;
            }

            return new Organization({
                id: organization.id,
                name: organization.name,
                image: organization.image,
                info: organization.info,
                mainColor: organization.main_color,
                approvalStatus: organization.approval_status,
                dateCreated: organization.date_created,
            });
        });
    }

    async findAllOrganizations(): Promise<Organization[]> {
        logger.verbose("Entering method findAllOrganizations()", {
            class: this.className,
        });

        const sqlSelect = "SELECT * FROM organization";

        return withClient(async (querier) => {
            const results = (await querier<OrganizationDatabaseInterface>(sqlSelect)).rows;

            return results.map(
                (organization) =>
                    new Organization({
                        id: organization.id,
                        name: organization.name,
                        image: organization.image,
                        info: organization.info,
                        mainColor: organization.main_color,
                        approvalStatus: organization.approval_status,
                        dateCreated: organization.date_created,
                    })
            );
        });
    }

    /**
     * Creates new organization and Master Admin
     *
     * @param organization - details for organization
     * @param admin - details of Master Admin for organization
     * @returns - Returns organization details if successful
     */
    async createOrganization(
        org: Organization,
        admin: Admin
    ): Promise<OrganizationWithAdmin | null> {
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
            const [organization] = (
                await querier<OrganizationDatabaseInterface>(sqlCreate, [
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

            const [administrator] = (
                await querier<AdminDatabaseInterface>(sqlAddAdmin, [
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

            const responseObject = {
                admin: new Admin({
                    authId: administrator.auth_id,
                    firstName: administrator.first_name,
                    lastName: administrator.last_name,
                    language: administrator.language,
                    emailAddress: administrator.email_address,
                    role: administrator.role,
                    status: administrator.status,
                    dateCreated: administrator.date_created,
                    organizationId: administrator.organization_id,
                }),
                organization: new Organization({
                    id: organization.id,
                    name: organization.name,
                    image: organization.image,
                    info: organization.info,
                    mainColor: organization.main_color,
                    approvalStatus: organization.approval_status,
                    dateCreated: organization.date_created,
                }),
            };
            return responseObject;
        });

        if (result === IsRollback) {
            return null;
        }

        return result;
    }

    async findAllAdminsByOrganizationId(orgId: string): Promise<Admin[]> {
        logger.verbose("Entering method findAllAdminsByOrganizationId()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM admin WHERE organization_id=$1";

        return withClient(async (querier) => {
            // const response = await querier(sqlAll, [orgId]);
            // const results = response.rows;

            // console.log(results);

            throw new Error("Method not implemented.");
        });
    }

    async findAllPlayersByOrganizationId(orgId: string) {
        logger.verbose("Entering method findAllPlayersByOrganizationId()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM admin WHERE organization_id=$1";

        return withClient(async (querier) => {
            // const response = await querier(sqlAll, [orgId]);
            // const results = response.rows;

            // console.log(results);

            throw new Error("Method not implemented.");
        });
    }

    async findAllTeamsByOrganizationId() {
        logger.verbose("Entering method findAllPlayersByOrganizationId()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM admin WHERE organization_id=$1";

        return withClient(async (querier) => {
            // const response = await querier(sqlAll, [orgId]);
            // const results = response.rows;

            // console.log(results);

            throw new Error("Method not implemented.");
        });
    }

    /**
     * Probably don't need delete method until much later. There should be other alternatives rather then completely deleting the organization. Will have to orchestrate what gets deleted.
     */
}

const test = new OrganizationDAO();

async function asyncFunc() {
    // console.log(await test.findAllOrganizations());
}

asyncFunc();
