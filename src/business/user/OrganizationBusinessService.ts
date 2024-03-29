import AdminDAO from "../../data/adminDAO";
import OrganizationDAO from "../../data/organizationDAO";
import { Admin } from "../../models/Admin";
import { APIResponse } from "../../models/APIResponse";
import { Organization } from "../../models/Organization";
import { TournamentGameStatus, TournamentType } from "../../utilities/enums/competitionEnum";
import logger from "../../utilities/winstonConfig";
import PlayerDAO from "../../data/playerDAO";
import { Player } from "../../models/Player";
import TeamDAO from "../../data/teamDAO";
import { Team } from "../../models/Team";
import { createAdminAuth0Account } from "../commonBusinessService";
import { AdminRole } from "../../utilities/enums/userEnum";
import { AdminWithPassword } from "../../interfaces/IAdmin";

const organizationDatabase = new OrganizationDAO();
const adminDatabase = new AdminDAO();
const playerDatabase = new PlayerDAO();
const teamDatabase = new TeamDAO();

export class OrganizationBusinessService {
    private readonly className = this.constructor.name;

    /**
     * Finds all organizations names and ids
     * @returns - organization list of only names and id pairs
     */
    async findOrganizationSignupList(): Promise<APIResponse | { id: string; name: string }[]> {
        logger.verbose("Entering method findOrganizationSignupList()", {
            class: this.className,
        });

        // fetches organizations
        return organizationDatabase.findAllOrganizationsWithNameAndId();
    }

    /**
     * Searches for organization with admin id
     * @param adminId - id of admin to search with
     * @returns - error response or organization with given id
     */
    async findOrganizationByAdminId(adminId: string): Promise<APIResponse | Organization> {
        logger.verbose("Entering method findOrganizationByAdminId()", {
            class: this.className,
            values: { adminId },
        });

        // find organization
        const organization = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (!organization) {
            return APIResponse.NotFound(`No organization found with admin id: ${adminId}`);
        }

        return organization;
    }

    /**
     * Searches for organization with player id
     * @param authId - id of player
     * @returns - error response or organization with given id
     */
    async findOrganizationByPlayerId(authId: string): Promise<APIResponse | Organization> {
        logger.verbose("Entering method findOrganizationByPlayerId()", {
            class: this.className,
            values: { authId },
        });

        // find organization
        const organization = await organizationDatabase.findOrganizationByPlayerId(authId);
        if (!organization) {
            return APIResponse.NewNotFound(authId);
        }

        return organization;
    }

    /**
     * Patches organization admin is under
     * @param adminId - id of admin to look for organization with
     * @returns - error response or Organization object. Currently returns not implemented response
     */
    async patchOrganizationByAdminId(adminId: string): Promise<APIResponse | Organization> {
        logger.verbose("Entering method patchOrganizationByAdminId()", {
            class: this.className,
            values: { adminId },
        });

        const admin = await adminDatabase.findAdminById(adminId);
        if (!admin) {
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        // need to create patch method for organization
        // const organization = await organizationDatabase.updateOrganization();

        return APIResponse.NotImplemented();
    }

    /**
     * Finds all player under organization using admin id
     * @param adminId - id of admin to look for organization with
     * @returns - error response or Player list
     */
    async findAllPlayers(adminId: string): Promise<APIResponse | Player[]> {
        logger.verbose("Entering method findAllPlayers()", {
            class: this.className,
            values: { adminId },
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (!organization) {
            return APIResponse.NotFound(`No organization found with admin id: ${adminId}`);
        }

        // returns all players in organization
        return playerDatabase.findAllPlayersByOrganizationId(organization.getId());
    }

    /**
     * Finds all teams under organization regardless of status
     * @param adminId - id of admin to look for organization with
     * @returns - error response or team list
     */
    async findAllTeams(adminId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findAllTeams()", {
            class: this.className,
            values: { adminId },
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (!organization) {
            return APIResponse.NotFound(`No organization found with admin id: ${adminId}`);
        }

        // returns all teams in organization
        return teamDatabase.findAllTeamsByOrganizationId(organization.getId());
    }

    /**
     * Finds all admins under organization
     * @param adminId - id of admin to look for organization with
     * @returns - error response or admin list
     */
    async findAllAdmins(authId: string): Promise<APIResponse | Admin[]> {
        logger.verbose("Entering method findAllAdmins()", {
            class: this.className,
            values: authId,
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationByAdminId(authId);
        if (!organization) {
            return APIResponse.NotFound(`No organization found with admin id: ${authId}`);
        }

        // returns all admins in organization
        return adminDatabase.findAllAdminsByOrganizationId(organization.getId());
    }

    /**
     * Creates new admin in organization
     * @param admin - admin to be added
     * @param authId - authorizing master admin id
     * @returns - the saved admin with temp password
     */
    async createAdmin(admin: Admin, authId: string): Promise<APIResponse | AdminWithPassword> {
        logger.verbose("Entering method createAdmin()", {
            class: this.className,
            values: authId,
        });

        // does admin exits
        const lookupAdmin = await adminDatabase.findAdminById(authId);
        if (!lookupAdmin) {
            return APIResponse.NewNotFound(authId);
        }

        // is the admin a master
        // only master's can create other admins
        if (lookupAdmin.getRole() !== AdminRole.MASTER) {
            return APIResponse.Forbidden(`${authId} not authorized to create admins`);
        }

        // does organization exist
        const organization = await organizationDatabase.findOrganizationByAdminId(authId);
        if (!organization) {
            return APIResponse.NotFound(`No organization found with admin id: ${authId}`);
        }

        // create auth0 account for new admin
        const auth0Admin = await createAdminAuth0Account(admin, organization.getName(), false);
        if (!auth0Admin) {
            return APIResponse.InternalError("Auth0 error");
        }

        // adds auth0 account and other details to database
        const newAdmin = await adminDatabase.createAdminByOrganizationId(
            auth0Admin,
            organization.getId()
        );

        return { ...newAdmin, password: "" } as AdminWithPassword;
    }

    // tournament visualizer = https://brackethq.com/maker/
}
