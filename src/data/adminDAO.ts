import { Admin } from "../models/Admin";
import logger from "../utilities/winstonConfig";
import { withClient } from "./database";
import { AdminDatabaseInterface } from "../interfaces/Admin";

export default class AdminDAO {
    readonly className = this.constructor.name;

    async createAdminByOrganizationId(admin: Admin, organizationId: string): Promise<Admin | null> {
        logger.verbose("Entering method createAdminByOrganizationId()", {
            class: this.className,
        });

        const sqlCreate =
            "INSERT INTO admin (auth_id, first_name, last_name, language, role, status, organization_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

        return withClient(async (querier) => {
            const [result] = (
                await querier<AdminDatabaseInterface>(sqlCreate, [
                    admin.getAuthId(),
                    admin.getFirstName(),
                    admin.getLastName(),
                    admin.getLanguage(),
                    admin.getRole(),
                    admin.getStatus(),
                    organizationId,
                ])
            ).rows;

            return new Admin({
                authId: result.auth_id,
                firstName: result.first_name,
                lastName: result.last_name,
                language: result.language,
                emailAddress: result.email_address,
                role: result.role,
                dateCreated: result.date_created,
                status: result.status,
                organizationId: result.organization_id,
            });
        });
    }

    // todo:patchAdmin method() to replace updateAdmin()

    // eslint-disable-next-line consistent-return
    async updateAdmin(admin: Admin) {
        logger.verbose("Entering method updateAdmin()", {
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
            return response;
        });
    }

    async deleteAdminById(adminId: string): Promise<string | null> {
        logger.verbose("Entering method deleteAdminById()", {
            class: this.className,
        });

        const sqlDelete = "DELETE FROM admin WHERE id=$1";

        return withClient(async (querier) => {
            const response = await querier(sqlDelete, [adminId]);
            if (response.rowCount < 0) {
                return null;
            }

            return adminId;
        });
    }

    async findAdminById(adminId: string): Promise<Admin | null> {
        logger.verbose("Entering method findAdminById()", {
            class: this.className,
            values: adminId,
        });

        const sql = "SELECT * FROM admin WHERE auth_id=$1";
        return withClient(async (querier) => {
            const [admin] = (await querier<AdminDatabaseInterface>(sql, [adminId])).rows;

            if (admin === undefined) {
                return null;
            }

            return new Admin({
                authId: admin.auth_id,
                firstName: admin.first_name,
                lastName: admin.last_name,
                language: admin.language,
                emailAddress: admin.email_address,
                role: admin.role,
                dateCreated: admin.date_created,
                status: admin.status,
                organizationId: admin.organization_id,
            });
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

const test = new AdminDAO();

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
