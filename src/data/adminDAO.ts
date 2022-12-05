import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import logger from "../utilities/winstonConfig";

const db = require("./database.js");

export default class adminDAO {
    className = this.constructor.name;

    async createCompetition_Tournament(
        organizationId: string
        // competition: Competition
    ) {
        logger.verbose("Entering method createCompetition_Tournament()", {
            class: this.className,
        });

        const conn = null;
        const sql = "";
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

        let client = null;

        // todo: adjust default values plugged in
        const sqlCreateOrg =
            "INSERT INTO organization (NAME, INFO, IMAGE, MAIN_COLOR) VALUES ($1, $2, $3, $4) RETURNING id";
        const sqlCreateMasterAdmin =
            "INSERT INTO admin (auth_id, first_name, last_name, language, role, status, organization_ID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING auth_id";

        try {
            client = await db.connect();
            await client.query("BEGIN");

            const orgResponse = await client.query(sqlCreateOrg, [
                org.getName(),
                org.getInfo(),
                org.getImage(),
                org.getMainColor(),
            ]);

            const { id } = orgResponse.rows[0];

            // todo: make call to auth0 management api to create admin account. Then use this authId
            const adminResponse = await client.query(sqlCreateMasterAdmin, [
                "test1",
                `${org.getName()} master admin`,
                null,
                "ENGLISH",
                "MASTER",
                "VALID",
                id,
            ]);
            console.log(adminResponse);

            await client.query("COMMIT");
            return adminResponse.rowCount;
        } catch (error) {
            // todo: improve error handling
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });

            await client.query("ROLLBACK");

            // todo: return enum
            return null;
        } finally {
            client?.release();
        }
        // try {
        //     conn = await pool.getConnection();
        //     let [resultCreateOrg, fields]  = await conn.query(sqlCreateOrg, [
        //         org.getName(),
        //         org.getInfo(),
        //         org.getImage(),
        //         org.getMainColor(),
        //         org.getApprovalStatus(),
        //         new Date(),
        //     ]);

        //     console.log(resultCreateOrg);
        //     await conn.commit()
        // } catch (error) {
        //     if (conn) await conn.rollback();

        // logger.error("Database Connection / Query Error", {
        //     type: error,
        //     class: this.className,
        // });

        //     return null;
        // } finally {
        //     if (conn) conn.release();
        // }
    }

    async findAllOrganizations() {
        logger.verbose("Entering method findAllOrganizations()", {
            class: this.className,
        });

        let client = null;
        const sqlAll = "SELECT * FROM organization";

        try {
            client = await db.connect();
            const response = await client.query(sqlAll);

            const results = response.rows;
            // console.log(response.rows);

            return results;
        } catch (error: any) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async deleteOrganizationById(orgId: string) {
        logger.verbose("Entering method deleteOrganizationById()", {
            class: this.className,
        });

        let client = null;

        const sqlDelete = "DELETE FROM organization WHERE id=$1";

        try {
            client = await db.connect();
            const response = await client.query(sqlDelete, [orgId]);

            // todo: Finish delete method when database is updated with cascade operation on delete
            console.log(response);
            // return results
        } catch (error: any) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async updateOrganization(org: Organization) {
        logger.verbose("Entering method updateOrganization()", {
            class: this.className,
        });

        let client = null;

        const sqlUpdate =
            "UPDATE organization SET name=$1, image=$2, info=$3, main_color=$4, approval_status=$5 WHERE id = $6 RETURNING *";
        try {
            client = await db.connect();
            const response = await client.query(sqlUpdate, [
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
        } catch (error: any) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async createAdmin(admin: Admin, organizationId: string) {
        let client = null;

        const sqlCreate =
            "INSERT INTO admin (auth_id, first_name, last_name, language, role, status, organization_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

        try {
            client = await db.connect();
            const results = await client.query(sqlCreate, [
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
        } catch (error: any) {
            console.log("TRACE: ", error);
            console.log("MESSAGE: ", (<Error>error).message);
            return null;
        } finally {
            client?.release();
        }
    }

    async updateAdmin(admin: Admin) {
        logger.verbose("Entering method ...()", {
            class: this.className,
        });

        let client = null;

        const sqlUpdate =
            "UPDATE admin SET first_name=$1, last_name=$2, language=$3, role=$4, status=$5 WHERE auth_id = $6 RETURNING *";
        try {
            client = await db.connect();
            const response = await client.query(sqlUpdate, [
                admin.getFirstName(),
                admin.getLastName(),
                admin.getLanguage(),
                admin.getRole(),
                admin.getStatus(),
                admin.getAuthId(),
            ]);

            console.log(response);
            // return results
        } catch (error: any) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async deleteAdminById(adminId: string) {
        logger.verbose("Entering method deleteAdminById()", {
            class: this.className,
        });

        let client = null;

        const sqlDelete = "DELETE FROM admin WHERE id=$1";
        try {
            client = await db.connect();
            const response = await client.query(sqlDelete, [adminId]);

            console.log(response);
            // return results
        } catch (error: any) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async findAdminById(adminId: string) {
        logger.verbose("Entering method findAdminById()", {
            class: this.className,
        });

        let client = null;

        const sql = "SELECT * FROM admin WHERE auth_id=$1";
        try {
            client = await db.connect();
            const response = await client.query(sql, [adminId]);
            const results = response.rows[0];

            console.log(results);

            // return results
        } catch (error: any) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async findAllAdminsInOrganization(orgId: string) {
        logger.verbose("Entering method findAllAdmins()", {
            class: this.className,
        });

        let client = null;

        const sqlAll = "SELECT * FROM admin WHERE organization_id=$1";
        try {
            client = await db.connect();
            const response = await client.query(sqlAll, [orgId]);
            const results = response.rows[0];

            console.log(results);

            // return results
        } catch (error: any) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
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

const test = new adminDAO();

// test.createOrganization(new Organization('','Grand Canyon University', '', 'The coolest University', 'purple', '', new Date()))
// test.findAllAdmins();
// test.findAllOrganizations()
// test.updateOrganization(new Organization("a5fe0074-2e47-492f-9aed-01748d856a93", "University of Arizona","", "Some more info on UOA", "Blue", "UNAPPROVED", new Date()))
// test.deleteOrganizationById("a5fe0074-2e47-492f-9aed-01748d856a93")

const admin = new Admin(
    "test1",
    "Noah",
    "Roerig",
    "ENGLISH",
    "noahr1936@gmail.com",
    "MASTER",
    new Date(),
    "VALID"
);

// test.updateAdmin(admin)
// test.findAllAdminsInOrganization("92181711-98ed-48c7-9cc6-75afaf2ba728")
// test.createAdmin(admin)
test.findAdminById("test");

// test.createOrganization(new Organization("2", "GCU", "none", "Christian", "Purple", "UNAPPROVED", new Date()))
// test.findAllOrganizations()
