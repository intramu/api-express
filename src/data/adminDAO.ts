import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import logger from "../utilities/winstonConfig";

import { rollbackWithErrors, useClient as withClient } from "./database";

export default class AdminDAO {
    readonly className = this.constructor.name;

    async createCompetitionTournament() {
        // competition: Competition
        // organizationId: string
        logger.verbose("Entering method createCompetition_Tournament()", {
            class: this.className,
        });

        // const conn = null;
        // const sql = "";
    }

    /**
     * Will create the organization and the master admin for the organization.
     * A auth0 account will have to be created then linked with this organization through
     * the use of a generated code.
     *
     * @param org
     */
    async createOrganization(org: Organization) {
        logger.verbose("Entering method createOrganization()", {
            class: this.className,
        });

        const rowCount = withClient(async (_, client) => {
            // todo: adjust default values plugged in
            const sqlCreateOrg =
                "INSERT INTO organization (NAME, INFO, IMAGE, MAIN_COLOR) VALUES ($1, $2, $3, $4) RETURNING id";
            const sqlCreateMasterAdmin =
                "INSERT INTO admin (auth_id, first_name, last_name, language, role, status, organization_ID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING auth_id";

            return rollbackWithErrors(client, async (querier) => {
                const orgResponse = await querier(sqlCreateOrg, [
                    org.getName(),
                    org.getInfo(),
                    org.getImage(),
                    org.getMainColor(),
                ]);

                const { id } = orgResponse.rows[0];

                // todo: make call to auth0 management api to create admin account. Then use this authId
                const adminResponse = await querier(sqlCreateMasterAdmin, [
                    "test1",
                    `${org.getName()} master admin`,
                    null,
                    "ENGLISH",
                    "MASTER",
                    "VALID",
                    id,
                ]);

                console.log({ adminResponse });

                return adminResponse.rowCount;
            });
        });

        console.log({ rowCount });
    }

    async findAllOrganizations() {
        logger.verbose("Entering method findAllOrganizations()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM organization";

        return withClient(async (querier) => {
            const response = await querier(sqlAll);

            const results = response.rows;
            // console.log(response.rows);

            return results;
        });
    }

    // eslint-disable-next-line consistent-return
    async deleteOrganizationById(orgId: string) {
        logger.verbose("Entering method deleteOrganizationById()", {
            class: this.className,
        });

        return withClient(async (querier) => {
            const sqlDelete = "DELETE FROM organization WHERE id=$1";

            const response = await querier(sqlDelete, [orgId]);

            // todo: Finish delete method when database is updated with cascade operation on delete
            console.log(response);
            // return results
        });
    }

    async updateOrganization(org: Organization) {
        logger.verbose("Entering method updateOrganization()", {
            class: this.className,
        });

        return withClient(async (querier) => {
            const sqlUpdate =
                "UPDATE organization SET name=$1, image=$2, info=$3, main_color=$4, approval_status=$5 WHERE id = $6 RETURNING *";
            const response = await querier(sqlUpdate, [
                org.getName(),
                org.getImage(),
                org.getInfo(),
                org.getMainColor(),
                org.getApprovalStatus(),
                org.getId(),
            ]);

            const results = response.rows;

            // console.log();
            return results;
        });
    }

    // eslint-disable-next-line class-methods-use-this, consistent-return
    async createAdmin(admin: Admin, organizationId: string) {
        return withClient(async (querier) => {
            const sqlCreate =
                "INSERT INTO admin (auth_id, first_name, last_name, language, role, status, organization_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

            const results = await querier(sqlCreate, [
                admin.getAuthId(),
                admin.getFirstName(),
                admin.getLastName(),
                admin.getLanguage(),
                admin.getRole(),
                admin.getStatus(),
                organizationId,
            ]);

            console.log(results);
            // return results
        });
    }

    // eslint-disable-next-line consistent-return
    async updateAdmin(admin: Admin) {
        logger.verbose("Entering method ...()", {
            class: this.className,
        });

        return withClient(async (querier) => {
            const sqlUpdate =
                "UPDATE admin SET first_name=$1, last_name=$2, language=$3, role=$4, status=$5 WHERE auth_id = $6 RETURNING *";
            const response = await querier(sqlUpdate, [
                admin.getFirstName(),
                admin.getLastName(),
                admin.getLanguage(),
                admin.getRole(),
                admin.getStatus(),
                admin.getAuthId(),
            ]);

            console.log(response);
            // return results
        });
    }

    async deleteAdminById(adminId: string): Promise<void> {
        logger.verbose("Entering method deleteAdminById()", {
            class: this.className,
        });

        return withClient(async (querier) => {
            const sqlDelete = "DELETE FROM admin WHERE id=$1";
            const response = await querier(sqlDelete, [adminId]);

            console.log(response);
        });
    }

    async findAdminById(adminId: string) {
        logger.verbose("Entering method findAdminById()", {
            class: this.className,
        });

        return withClient(async (querier) => {
            const sql = "SELECT * FROM admin WHERE auth_id=$1";
            const response = await querier(sql, [adminId]);
            const results = response.rows[0];

            console.log(results);
            return results;
        });
    }

    async findAllAdminsInOrganization(orgId: string): Promise<Admin[]> {
        logger.verbose("Entering method findAllAdmins()", {
            class: this.className,
        });

        return withClient(async (querier) => {
            const sqlAll = "SELECT * FROM admin WHERE organization_id=$1";

            const response = await querier(sqlAll, [orgId]);
            const results = response.rows;

            console.log(results);

            throw new Error("Method not implemented.");
        });
    }
}

// possible error handling
// if(error.errno === -4078)
// {
//     console.log("WOWZA");

// }
// console.log("TRACE: ", error.errno);
// console.log("MESSAGE: ", (<Error>error).stack);
// switch(error){
//     case error.errno === -4078: {console.log("TEST ERROR");
//                 break}
//     case Error: {console.log("GENERAL ERROR")
//                 break};

//     default: console.log("UNKNOWN ERROR");

// }

// const test = new AdminDAO();

// test.createOrganization(new Organization('','Grand Canyon University', '', 'The coolest University', 'purple', '', new Date()))
// test.findAllAdmins();
// test.findAllOrganizations()
// test.updateOrganization(new Organization("a5fe0074-2e47-492f-9aed-01748d856a93", "University of Arizona","", "Some more info on UOA", "Blue", "UNAPPROVED", new Date()))
// test.deleteOrganizationById("a5fe0074-2e47-492f-9aed-01748d856a93")

// const admin = new Admin(
//     "test1",
//     "Noah",
//     "Roerig",
//     "ENGLISH",
//     "noahr1936@gmail.com",
//     "MASTER",
//     new Date(),
//     "VALID"
// );

// test.updateAdmin(admin)
// test.findAllAdminsInOrganization("92181711-98ed-48c7-9cc6-75afaf2ba728")
// test.createAdmin(admin)
// test.findAdminById("test");

// test.createOrganization(new Organization("2", "GCU", "none", "Christian", "Purple", "UNAPPROVED", new Date()))
// test.findAllOrganizations()
