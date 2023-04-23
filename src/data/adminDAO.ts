import { Admin } from "../models/Admin";
import logger from "../utilities/winstonConfig";
import { withClient } from "./database";
import { IAdminDatabase } from "../interfaces/IAdmin";

/** Admin database methods */
export default class AdminDAO {
    readonly className = this.constructor.name;

    /**
     * Creates admin under organization with given id
     * @param admin - must not be null
     * @param organizationId - id of organization; must not be null
     * @returns - the saved admin
     * @throws - if error when creating admin
     */
    async createAdminByOrganizationId(admin: Admin, organizationId: string): Promise<Admin> {
        logger.verbose("Entering method createAdminByOrganizationId()", {
            class: this.className,
            values: { admin, organizationId },
        });

        const sqlCreate =
            "INSERT INTO admin (auth_id, first_name, last_name, language, role, status, organization_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

        return withClient(async (querier) => {
            const [response] = (
                await querier<IAdminDatabase>(sqlCreate, [
                    admin.getAuthId(),
                    admin.getFirstName(),
                    admin.getLastName(),
                    admin.getLanguage(),
                    admin.getRole(),
                    admin.getStatus(),
                    organizationId,
                ])
            ).rows;

            if (!response) {
                logger.error("Error creating admin", {
                    class: this.className,
                });
                throw new Error("Error creating admin");
            }

            return Admin.fromDatabase(response);
        });
    }

    // todo:patchAdmin method() to replace updateAdmin()
    /**
     * Updates admin by its id
     * @param admin - must not be null
     * @returns - the updated admin
     * @throws - if error when updating admin
     */
    async updateAdmin(admin: Admin): Promise<Admin> {
        logger.verbose("Entering method updateAdmin()", {
            class: this.className,
            values: { admin },
        });

        const sqlUpdate =
            "UPDATE admin SET first_name=$1, last_name=$2, language=$3, role=$4, status=$5 WHERE auth_id = $6 RETURNING *";

        return withClient(async (querier) => {
            const [response] = (
                await querier<IAdminDatabase>(sqlUpdate, [
                    admin.getFirstName(),
                    admin.getLastName(),
                    admin.getLanguage(),
                    admin.getRole(),
                    admin.getStatus(),
                    admin.getAuthId(),
                ])
            ).rows;

            if (!response) {
                logger.error("Error creating admin", {
                    class: this.className,
                });
                throw new Error("Error creating admin");
            }

            return Admin.fromDatabase(response);
        });
    }

    /**
     * Deletes admin with the given id
     * @param adminId - must not be null
     * @returns - void
     */
    async removeAdminById(adminId: string): Promise<void> {
        logger.verbose("Entering method removeAdminById()", {
            class: this.className,
            values: adminId,
        });

        const sqlDelete = "DELETE FROM admin WHERE auth_id=$1";

        return withClient(async (querier) => {
            await querier(sqlDelete, [adminId]);
        });
    }

    /**
     * Retrieves admin by its id
     * @param adminId - must not be null
     * @returns - admin with given id or null if not found
     */
    async findAdminById(adminId: string): Promise<Admin | null> {
        logger.verbose("Entering method findAdminById()", {
            class: this.className,
            values: adminId,
        });

        const sql = "SELECT * FROM admin WHERE auth_id=$1";
        return withClient(async (querier) => {
            const [admin] = (await querier<IAdminDatabase>(sql, [adminId])).rows;

            if (admin === undefined) {
                return null;
            }

            return Admin.fromDatabase(admin);
        });
    }

    /**
     * Returns all instances of admin with given organization id
     * @param orgId - must not be null
     * @returns - admin list with the given id
     */
    async findAllAdminsByOrganizationId(orgId: string): Promise<Admin[]> {
        logger.verbose("Entering method findAllAdminsByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const sqlFind = "SELECT * FROM admin WHERE organization_id = $1";
        return withClient(async (querier) => {
            const admins = (await querier<IAdminDatabase>(sqlFind, [orgId])).rows;

            return admins.map((admin) => Admin.fromDatabase(admin));
        });
    }

    /**
     * Returns all instances of admin
     * @returns - admin list
     */
    async findAllAdmins(): Promise<Admin[]> {
        logger.verbose("Entering method findAllAdmins()", {
            class: this.className,
        });

        const sqlFind = "SELECT * FROM admin";
        return withClient(async (querier) => {
            const admins = (await querier<IAdminDatabase>(sqlFind)).rows;

            return admins.map((admin) => Admin.fromDatabase(admin));
        });
    }
}
