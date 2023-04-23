import { AdminWithPassword } from "../interfaces/IAdmin";
import { Admin } from "../models/Admin";
import { auth0, generateRandomPasword } from "../utilities/authUtilities";
import { AdminRole, AdminStatus } from "../utilities/enums/userEnum";
import logger from "../utilities/winstonConfig";

const className = "commonBusinessService";

// todo: fetch dynamically
// from auth0 role list; applied to all admins
const adminRoleId = "rol_XJ4AgARn1VDiSGw7";

/**
 * Creates admin auth0 account with provided details
 * @param admin - admin object
 * @param organizationName - organization name to be added to admin object
 * @param isMaster - is the account being created the master admin
 * @returns - created admin with password
 */
export async function createAdminAuth0Account(
    admin: Admin,
    organizationName: string,
    isMaster: boolean
): Promise<AdminWithPassword | null> {
    logger.verbose("Entering method createAdminAuth0Account()", {
        class: className,
        values: { organizationName, admin, isMaster },
    });

    const randomPassword = generateRandomPasword;

    // auth0 user object is created
    const newAuthUser = {
        // todo: be able to change blocked, verify_email, and email_verified values
        email: admin.getEmailAddress(),
        user_metadata: {
            profile_completion_status: "complete",
        },
        blocked: false,
        email_verified: false,
        // default values for this query give the admin a generic name if once isn't provided
        given_name:
            admin.getFirstName() ||
            `${organizationName} ${isMaster ? "Master Administrator" : "Administrator"}`,
        family_name: admin.getLastName() || "",
        name: `${admin.getFirstName()} ${admin.getLastName()}`,
        connection: "Username-Password-Authentication",
        password: randomPassword,
        verify_email: true,
    };

    // user object is created in auth0
    const auth0Admin = await auth0.createUser(newAuthUser);
    if (!auth0Admin.user_id) {
        logger.error("Auth0 error creating user", {
            class: className,
            values: { newAuthUser, randomPassword },
        });
        return null;
    }

    // assigns the admin role in auth0, to the created user
    auth0.assignRolestoUser({ id: auth0Admin.user_id }, { roles: [adminRoleId] }).catch((err) => {
        logger.error("Error assigning role to user auth0", {
            class: className,
            values: { auth0Admin },
            trace: err,
        });
        return null;
    });

    // role is automatically set to MASTER for the first admin
    const role = isMaster ? AdminRole.MASTER : AdminRole.WORKER;

    const newAdmin = new Admin({
        authId: auth0Admin.user_id,
        firstName: auth0Admin.given_name,
        lastName: auth0Admin.family_name,
        language: admin.getLanguage(),
        emailAddress: admin.getEmailAddress(),
        role: role,
        // status is set to active
        status: AdminStatus.ACTIVE,
        // organizationId: "",
    });

    return { ...newAdmin, password: randomPassword } as AdminWithPassword;
}
