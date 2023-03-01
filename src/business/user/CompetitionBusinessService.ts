import AdminDAO from "../../data/adminDAO";
import ContestDAO from "../../data/contestDAO";
import OrganizationDAO from "../../data/organizationDAO";
import { APIResponse } from "../../models/APIResponse";
import { Bracket } from "../../models/competition/Bracket";
import { Contest } from "../../models/competition/Contest";
import { League } from "../../models/competition/League";
import logger from "../../utilities/winstonConfig";

const contestDatabase = new ContestDAO();
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
    async createContest(newContest: Contest, adminId: string): Promise<APIResponse | Contest> {
        logger.verbose("Entering method createContest()", {
            class: this.className,
            values: newContest,
        });

        // finds organization id that admin belongs too
        const org = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (org === null) {
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        // add contest to database under organization
        const contest = await contestDatabase.createContest(newContest, org.getId());

        return contest;
    }

    /**
     * Creates new leagues, divisions, and brackets under contest.
     * @param leagues - league tree to be added
     * @param contestId - id of contest to create leagues under
     * @param adminId - id of authorizing admin
     * @returns - error response or true if success
     */
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
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        // check if contest exists in organization
        const contests = await contestDatabase.findContestsByOrganizationId(org.getId());
        if (contests.some((contest) => contest.getId() === contestId)) {
            return APIResponse.NotFound(`No contest found with id: ${contestId}`);
        }

        // modifies list to add waitlist for each division
        const leaguesWithWaitlist = this.addWaitlistBracket(leagues);

        // creates leagues
        await contestDatabase.createLeaguesAndChildren(leaguesWithWaitlist, org.getId(), contestId);

        return true;
    }

    /**
     * loops through all divisions and adds a Waitlist bracket for every division
     * @param leagues - list of leagues
     * @returns - modified list with waitlist
     */
    private addWaitlistBracket(leagues: League[]): League[] {
        return leagues.map((league) => {
            league.getDivisions().map((division) => {
                // pushes new bracket into each division
                // has max team limit of 1000, basically unlimited
                division.getBrackets().push(new Bracket({ maxTeamAmount: 1000 }));
                return division;
            });
            return league;
        });
    }

    /**
     * Finds league tree under contest
     * @param contestId - id of contest to look under
     * @param adminId - id of authorizing admin
     * @returns
     */
    async findLeaguesByContestId(
        contestId: number,
        adminId: string
    ): Promise<APIResponse | League[]> {
        logger.verbose("Entering method findLeaguesByContestId()", {
            class: this.className,
            values: { contestId, adminId },
        });

        const organization = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (organization === null) {
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        const contests = await contestDatabase.findContestsByOrganizationId(organization.getId());
        if (contests.some((contest) => contest.getId() === contestId)) {
            return APIResponse.Forbidden(`Cannot access contest outside organization`);
        }

        return await contestDatabase.findLeaguesAndChildrenByContestId(contestId);
    }
}

const test = new CompetitionBusinessService();
