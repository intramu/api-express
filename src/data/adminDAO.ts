import mysql2 from "mysql2/promise";
// import { Competition } from "../models/Competition";
import { Organization } from "../models/Organization";
import logger from "../utilities/winstonConfig";

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

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

        let conn = null;
        const sqlCreateOrg =
            "INSERT INTO organization (ID, NAME, INFO, IMAGE, MAIN_COLOR, APPROVAL_STATUS, DATE_CREATED) VALUES (UNHEX(REPLACE('8418a13e-2bb1-42cf-8736-a3e6d82a4eef','-',''))),?,?,?,?,?,?)";

        const sqlCreateMasterAdmin =
            "INSERT INTO admin (AUTH_ID, FIRST_NAME, LAST_NAME, LANGUAGE, ROLE, DATE_CREATED, organization_ID) VALUES (?,?,?,?,?,?,?) ";

        try {
            conn = await pool.getConnection();
            const [resultCreateOrg, fields] = await conn.query(sqlCreateOrg, [
                org.getName(),
                org.getInfo(),
                org.getImage(),
                org.getMainColor(),
                org.getApprovalStatus(),
                new Date(),
            ]);

            console.log(resultCreateOrg);
        } catch (error) {
            if (conn) await conn.rollback();

            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });

            return null;
        } finally {
            if (conn) conn.release();
        }
    }

    async findAllOrganization() {}

    async deleteOrganization() {}

    async updateOrganization() {}

    async createAdmin() {}

    async updateAdmin() {}

    async deleteAdmin() {}
}
