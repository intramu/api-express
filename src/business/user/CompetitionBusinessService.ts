import AdminDAO from "../../data/adminDAO";
import CompetitionDAO from "../../data/competitionDAO";
import OrganizationDAO from "../../data/organizationDAO";
import { APIResponse } from "../../models/APIResponse";
import { Contest } from "../../models/competition/Contest";
import { League } from "../../models/competition/League";
import logger from "../../utilities/winstonConfig";

const competitionDatabase = new CompetitionDAO();
const organizationDatabase = new OrganizationDAO();
const adminDatabase = new AdminDAO();

export class CompetitionBusinessService {
    private readonly className = this.constructor.name;

    /**
     * Creates new contest under organization using admin id
     * Worker admins are allowed to create contests
     * @param newContest - contest details
     * @param adminId - id of admin creating contest
     * @returns - error response or contest object if successful
     */
    // REVISIT - not separation safe across multiple organizations
    async createContest(newContest: Contest, adminId: string): Promise<APIResponse | Contest> {
        logger.verbose("Entering method createContest()", {
            class: this.className,
            values: newContest,
        });

        const org = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (org === null) {
            return APIResponse[404](`No admin found with id: ${adminId}`);
        }

        // create new contest and assign the organizationId to it
        const finalContest: Contest = newContest;
        finalContest.setOrganizationId(org.getId());

        const contest = await competitionDatabase.createContest(newContest);
        if (contest === null) {
            return APIResponse[500]("Error creating contest");
        }

        return contest;
    }

    /**
     * Creates new leagues, divisions, and brackets under contest.
     * @param leagues - league tree to be added
     * @param contestId - id of contest to create leagues under
     * @param adminId - id of authorizing admin
     * @returns - error response or true if success
     */
    // REVISIT - not separation safe across multiple organizations
    async createLeagues(
        leagues: League[],
        contestId: number,
        adminId: string
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method createLeagues()", {
            class: this.className,
            values: { leagues, contestId, adminId },
        });

        // looks if admin belongs to organization
        const org = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (org === null) {
            return APIResponse[404](`No admin found with id: ${adminId}`);
        }

        // looks to see if contest exists yet
        const contest = await competitionDatabase.findContestById(contestId);
        if (contest === null) {
            return APIResponse[404](`No contest found with id: ${contestId}`);
        }

        // creates leagues
        const response = await competitionDatabase.createLeaguesAndChildren(
            leagues,
            org.getId(),
            contest.getId()
        );
        if (!response) {
            return APIResponse[500]("Error creating leagues");
        }

        return true;
    }

    /**
     * Finds league tree under contest
     * @param contestId - id of contest to look under
     * @param adminId - id of authorizing admin
     * @returns
     */
    // REVISIT - not separation safe across multiple organizations
    async findLeaguesByContestId(
        contestId: number,
        adminId: string
    ): Promise<APIResponse | League[]> {
        logger.verbose("Entering method findLeaguesByContestId()", {
            class: this.className,
            values: { contestId, adminId },
        });

        const admin = await adminDatabase.findAdminById(adminId);
        if (admin === null) {
            return APIResponse[404](`No admin found with id: ${adminId}`);
        }

        const contest = await competitionDatabase.findContestById(contestId);
        if (contest === null) {
            return APIResponse[404](`No contest found with id: ${contest}`);
        }

        const leagues = await competitionDatabase.findLeaguesAndChildrenByContestId(contestId);

        return leagues;
    }
}
