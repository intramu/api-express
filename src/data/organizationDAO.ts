import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import { Role } from "../utilities/enums";
import { OrgWithAdmin } from "../utilities/interfaces";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";

export default class OrganizationDAO {
    private readonly className = this.constructor.name;

    async findOrganizationById(orgId: string): Promise<Organization | null> {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
            values: orgId,
        });

        const sqlSelect = "SELECT * FROM organization WHERE id=$1";

        return withClient(async (querier) => {
            const response = await querier(sqlSelect, [orgId]);
            const [results] = response.rows;

            if (results === undefined) {
                return null;
            }

            return new Organization(
                results.id,
                results.name,
                results.image,
                results.info,
                results.main_color,
                results.approval_status,
                results.date_created
            );
        });
    }

    async updateOrganization(organization: Organization): Promise<Organization | null> {
        logger.verbose("Entering method updateOrganization()", {
            class: this.className,
            values: organization,
        });

        const sqlUpdate =
            "UPDATE organization SET name=$1, image=$2, info=$3, main_color=$4, approval_status=$5 WHERE id=$6";

        return withClient(async (querier) => {
            const response = await querier(sqlUpdate, [
                organization.getName(),
                organization.getImage(),
                organization.getInfo(),
                organization.getMainColor(),
                organization.getApprovalStatus(),
            ]);
            const [results] = response.rows;

            if (response.rowCount === 0) {
                return null;
            }

            return new Organization(
                results.id,
                results.name,
                results.image,
                results.info,
                results.main_color,
                results.approval_status,
                results.date_created
            );
        });
    }

    async findAllOrganizations(): Promise<Organization[]> {
        logger.verbose("Entering method findAllOrganizations()", {
            class: this.className,
        });

        const sqlSelect = "SELECT * FROM organization";

        return withClient(async (querier) => {
            const results = (await querier(sqlSelect)).rows;

            return results.map(
                (org) =>
                    new Organization(
                        org.id,
                        org.name,
                        org.image,
                        org.info,
                        org.main_color,
                        org.approval_status,
                        org.date_created
                    )
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
        organization: Organization,
        admin: Admin
    ): Promise<OrgWithAdmin | null> {
        logger.verbose("Entering method createOrganization()", {
            class: this.className,
            values: organization,
        });

        const sqlCreate =
            "INSERT INTO organization (name, image, info, main_color, approval_status) VALUES ($1, $2, $3, $4, $5)";

        const sqlAddAdmin =
            "INSERT INTO admin (auth_id, first_name, last_name, language, email_address, role, status, organization_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)";

        const result = await withClientRollback(async (querier) => {
            const responseOne = await querier(sqlCreate, [
                organization.getName(),
                organization.getImage(),
                organization.getInfo(),
                organization.getMainColor(),
                organization.getApprovalStatus(),
            ]);
            const [resultsOne] = responseOne.rows;

            if (resultsOne === undefined) {
                return IsRollback;
            }

            const responseTwo = await querier(sqlAddAdmin, [
                admin.getAuthId(),
                admin.getFirstName(),
                admin.getLastName(),
                admin.getLanguage,
                admin.getEmailAddress(),
                admin.getRole(),
                admin.getStatus(),
                resultsOne.organization_id,
            ]);

            const [resultsTwo] = responseTwo.rows;

            if (resultsTwo === undefined) {
                return IsRollback;
            }

            // const newOrganization: Organization =

            const responseObject = {
                admin: new Admin(
                    resultsOne.auth_id,
                    resultsOne.first_name,
                    resultsOne.last_name,
                    resultsOne.language,
                    resultsOne.email_address,
                    resultsOne.role,
                    resultsOne.status,
                    resultsOne.date_created,
                    resultsOne.organization_id
                ),
                organization: new Organization(
                    resultsTwo.id,
                    resultsTwo.name,
                    resultsTwo.image,
                    resultsTwo.info,
                    resultsTwo.main_color,
                    resultsTwo.approval_status,
                    resultsTwo.date_created
                ),
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
