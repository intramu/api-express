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
    // classname for logger
    private readonly className = this.constructor.name;

    /**
     * Creates contest under organization
     * @param contest - contest to be added
     * @param orgId - organization contest goes under
     * @returns - error response or the saved contest
     */
    async createContest(contest: Contest, orgId: string): Promise<APIResponse | Contest> {
        logger.verbose("Entering method createContest()", {
            class: this.className,
            values: { contest },
        });

        // does organization exist
        const org = await organizationDatabase.findOrganizationById(orgId);
        if (!org) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        // add contest to database under organization
        return contestDatabase.createContest(contest, orgId);
    }

    /**
     * Returns all contests under organization
     * @param orgId - organization id to search under
     * @returns - error response or contest list
     */
    async findContestsByOrganizationId(orgId: string): Promise<APIResponse | Contest[]> {
        logger.verbose("Entering method findContestsByOrganizationId()", {
            class: this.className,
            values: { orgId },
        });

        // does organization exist
        const org = await organizationDatabase.findOrganizationById(orgId);
        if (!org) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        // find contests
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

        // does contest exist
        const contest = await contestDatabase.findContestById(contestId);
        if (!contest) {
            return APIResponse.NotFound(`No contest found with id: ${contestId}`);
        }

        // waitlist added to every division
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

        // does contest exist
        const contest = await contestDatabase.findContestById(contestId);
        if (!contest) {
            return APIResponse.NotFound(`No contest found with id: ${contest}`);
        }

        // fetch all leagues and children under contest
        const leagues = await contestDatabase.findLeaguesAndChildrenByContestId(contestId);
        // assign leagues
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
