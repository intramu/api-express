import { randomUUID } from "crypto";
import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import logger from "../utilities/winstonConfig";

import { IsRollback, withClient, withClientRollback } from "./database";

import { Gender } from "../utilities/enums";

export default class AdminDAO {
    readonly className = this.constructor.name;

    // eslint-disable-next-line class-methods-use-this, consistent-return
    async createAdminByOrganizationId(admin: Admin, organizationId: string) {
        return withClient(async (querier) => {
            const sqlCreate =
                "INSERT INTO admin (auth_id, first_name, last_name, language, role, status, organization_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

            const response = await querier(sqlCreate, [
                admin.getAuthId(),
                admin.getFirstName(),
                admin.getLastName(),
                admin.getLanguage(),
                admin.getRole(),
                admin.getStatus(),
                organizationId,
            ]);
            const [results] = response.rows;
            console.log(results);
            return results;
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
