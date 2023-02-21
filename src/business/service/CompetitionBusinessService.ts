import ContestDAO from "../../data/contestDAO";
import OrganizationDAO from "../../data/organizationDAO";
import { APIResponse } from "../../models/APIResponse";
import { Contest } from "../../models/competition/Contest";
import { League } from "../../models/competition/League";
import logger from "../../utilities/winstonConfig";

const contestDatabase = new ContestDAO();
const organizationDatabase = new OrganizationDAO();

export class CompetitionBusinessService {
    private readonly className = this.constructor.name;

    /**
     *
     * @param newContest
     * @param orgId
     * @returns
     */
    async createContest(newContest: Contest, orgId: string): Promise<APIResponse | Contest> {
        logger.verbose("Entering method createContest()", {
            class: this.className,
            values: newContest,
        });

        // finds organization id that admin belongs too
        const org = await organizationDatabase.findOrganizationById(orgId);
        if (!org) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        // add contest to database under organization
        const contest = await contestDatabase.createContest(newContest, orgId);

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
        orgId: string
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method createLeagues()", {
            class: this.className,
            values: { leagues, contestId, orgId },
        });

        // finds organization id that admin belongs too
        const org = await organizationDatabase.findOrganizationById(orgId);
        if (!org) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        // looks to see if contest exists yet
        const contest = await contestDatabase.findContestById(contestId);
        if (contest === null) {
            return APIResponse.NotFound(`No contest found with id: ${contestId}`);
        }

        // creates leagues
        const response = await contestDatabase.createLeaguesAndChildren(
            leagues,
            org.getId(),
            contest.getId()
        );
        if (!response) {
            return APIResponse.InternalError("Error creating leagues");
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
    async findLeaguesByContestId(contestId: number): Promise<APIResponse | League[]> {
        logger.verbose("Entering method findLeaguesByContestId()", {
            class: this.className,
            values: { contestId },
        });

        const contest = await contestDatabase.findContestById(contestId);
        if (contest === null) {
            return APIResponse.NotFound(`No contest found with id: ${contest}`);
        }

        const leagues = await contestDatabase.findLeaguesAndChildrenByContestId(contestId);

        return leagues;
    }

    // TODO
    // async patchContest()
    // async findAllContests()
}
