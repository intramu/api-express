import ContestDAO from "../../data/contestDAO";
import OrganizationDAO from "../../data/organizationDAO";
import { APIResponse } from "../../models/APIResponse";
import { Bracket } from "../../models/competition/Bracket";
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
        return contestDatabase.createContest(newContest, orgId);
    }

    async findContestsByOrganizationId(orgId: string): Promise<APIResponse | Contest[]> {
        logger.verbose("Entering method findContestsByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const org = await organizationDatabase.findOrganizationById(orgId);
        if (!org) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        return contestDatabase.findContestsByOrganizationId(orgId);
    }

    /**
     * Creates new leagues, divisions, and brackets under contest.
     * @param leagues - league tree to be added
     * @param contestId - id of contest to create leagues under
     * @param adminId - id of authorizing admin
     * @returns - error response or true if success
     */
    async createLeagues(leagues: League[], contestId: number): Promise<APIResponse | boolean> {
        logger.verbose("Entering method createLeagues()", {
            class: this.className,
            values: { leagues, contestId },
        });

        // looks to see if contest exists yet
        const contest = await contestDatabase.findContestById(contestId);
        if (contest === null) {
            return APIResponse.NotFound(`No contest found with id: ${contestId}`);
        }

        const leaguesWithWaitlist = this.addWaitlistBracket(leagues);

        // create leagues
        await contestDatabase.createLeaguesAndChildren(leaguesWithWaitlist, contest.getId());
        return true;
    }

    /**
     * Finds league tree under contest
     * @param contestId - id of contest to look under
     * @param adminId - id of authorizing admin
     * @returns
     */
    async findContestAndChildrenById(contestId: number): Promise<APIResponse | Contest> {
        logger.verbose("Entering method findContestAndChildrenById()", {
            class: this.className,
            values: { contestId },
        });

        const contest = await contestDatabase.findContestById(contestId);
        if (contest === null) {
            return APIResponse.NotFound(`No contest found with id: ${contest}`);
        }

        const leagues = await contestDatabase.findLeaguesAndChildrenByContestId(contestId);
        contest.setLeagues(leagues);

        return contest;
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
                division.getBrackets().push(new Bracket({ maxTeamAmount: 0 }));
                return division;
            });
            return league;
        });
    }

    // TODO
    // async patchContest()
    // async findAllContests()
}
