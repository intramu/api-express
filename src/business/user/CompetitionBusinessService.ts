import AdminDAO from "../../data/adminDAO";
import ContestDAO from "../../data/contestDAO";
import OrganizationDAO from "../../data/organizationDAO";
import { IContestGameReport } from "../../interfaces/IContestGame";
import { APIResponse } from "../../models/APIResponse";
import { Bracket } from "../../models/competition/Bracket";
import { Contest } from "../../models/competition/Contest";
import { ContestGame } from "../../models/competition/ContestGame";
import { League } from "../../models/competition/League";
import { CompetitionStatus } from "../../utilities/enums/competitionEnum";
import logger from "../../utilities/winstonConfig";

const contestDatabase = new ContestDAO();
const organizationDatabase = new OrganizationDAO();
const adminDatabase = new AdminDAO();

export class CompetitionBusinessService {
    // classname for logger
    private readonly className = this.constructor.name;

    /**
     * loops through all divisions and adds a Waitlist bracket for every division
     * @param leagues - list of leagues
     * @returns - modified list with waitlist
     */
    private addWaitlistBracket(leagues: League[]): League[] {
        return leagues.map((league) => {
            league.getDivisions().map((division) => {
                // pushes new bracket into each division
                // sets max team limit to 0 meaning unlimited
                division.getBrackets().push(new Bracket({ maxTeamAmount: 0 }));
                return division;
            });
            return league;
        });
    }

    /**
     * Creates new contest under organization using admin id
     * @param contest - contest details
     * @param adminId - id of admin creating contest
     * @returns - error response or the saved contest
     */
    async createContest(contest: Contest, adminId: string): Promise<APIResponse | Contest> {
        logger.verbose("Entering method createContest()", {
            class: this.className,
            values: contest,
        });

        // finds organization id that admin belongs too
        const org = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (!org) {
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        // add contest to database under organization
        return contestDatabase.createContest(contest, org.getId());
    }

    /**
     * Creates new leagues, divisions, and brackets under contest.
     * @param leagues - league tree to be added
     * @param contestId - id of contest to create leagues under
     * @param adminId - id of authorizing admin
     * @returns - error response or void if success
     */
    async createLeagues(
        leagues: League[],
        contestId: number,
        adminId: string
    ): Promise<APIResponse | void> {
        logger.verbose("Entering method createLeagues()", {
            class: this.className,
            values: { leagues, contestId, adminId },
        });

        // looks if admin belongs to organization
        const org = await organizationDatabase.findOrganizationByAdminId(adminId);
        if (!org) {
            return APIResponse.NotFound(`No admin found with id: ${adminId}`);
        }

        // check if contest exists in organization
        const contest = await contestDatabase.findContestByIdAndOrgId(contestId, org.getId());
        if (!contest) {
            return APIResponse.NotFound(`No contest found with id: ${contestId}`);
        }

        // modifies list to add waitlist for each division
        const leaguesWithWaitlist = this.addWaitlistBracket(leagues);

        // creates leagues
        await contestDatabase.createLeaguesAndChildren(leaguesWithWaitlist, contestId);
    }

    /**
     * Finds league tree under contest
     * @param contestId - id of contest to look under
     * @param playerId - id of authorizing admin
     * @returns - error response or contest with given ids
     */
    async findContestAndChildrenById(
        contestId: number,
        playerId: string
    ): Promise<APIResponse | Contest> {
        logger.verbose("Entering method findContestAndChildrenById()", {
            class: this.className,
            values: { contestId, playerId },
        });

        // let organization = await organizationDatabase.findOrganizationByAdminId(userId);
        const organization = await organizationDatabase.findOrganizationByPlayerId(playerId);
        if (!organization) {
            return APIResponse.NewNotFound(playerId);
        }

        // does contest exist in organization
        const contest = await contestDatabase.findContestByIdAndOrgId(
            contestId,
            organization.getId()
        );
        if (!contest) {
            return APIResponse.NewNotFound(contestId.toString());
        }

        // fetch leagues then assign them to the contest
        const leagues = await contestDatabase.findLeaguesAndChildrenByContestId(contestId);
        contest.setLeagues(leagues);

        return contest;
    }

    /**
     * Finds all contest in organization that are active
     * @param playerId - id of player to search for organization with
     * @returns - error response or contest list
     */
    // TODO: add query parameters to change what contests are fetched
    async findAllActiveContests(playerId: string): Promise<APIResponse | Contest[]> {
        logger.verbose("Entering method findAllActiveContests()", {
            class: this.className,
            values: { playerId },
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationByPlayerId(playerId);
        if (!organization) {
            return APIResponse.NewNotFound(playerId);
        }

        const contests = (
            await contestDatabase.findContestsByOrganizationId(organization.getId())
        ).filter((x) => x.getStatus() === CompetitionStatus.ACTIVE);

        return contests;
    }

    /**
     * Finds all contests in organization with children.
     *
     * Does not currently filter for active contests
     * @param playerId
     */
    async findAllContestsAndChildren(playerId: string): Promise<APIResponse | Contest[]> {
        logger.verbose("Entering method findAllContestsAndChildren()", {
            class: this.className,
            values: playerId,
        });

        // does organization exist
        const organization = await organizationDatabase.findOrganizationByPlayerId(playerId);
        if (!organization) {
            return APIResponse.NewNotFound(playerId);
        }

        // find all contest in organization
        const contests = await contestDatabase.findContestsByOrganizationId(organization.getId());

        // for every contest query for leagues and children
        const list = await Promise.all(
            contests.map(async (contest) => {
                const leagues = await contestDatabase.findLeaguesAndChildrenByContestId(
                    contest.getId()
                );
                contest.setLeagues(leagues);
                return contest;
            })
        );

        return list;
    }

    /**
     * Creates new contest game in organization bracket
     * @param game - game to add
     * @param bracketId - bracket to add game under
     * @param authId - admin authorizing addition
     * @returns - error response or saved contest game
     */
    async createContestGame(
        game: ContestGame,
        bracketId: number,
        authId: string
    ): Promise<APIResponse | ContestGame> {
        logger.verbose("Entering method createContestGame()", {
            class: this.className,
            values: { authId },
        });

        // TODO: check if contest & bracket exists in organization
        // does organization exist
        const org = await organizationDatabase.findOrganizationByAdminId(authId);
        if (!org) {
            return APIResponse.NewNotFound(authId);
        }

        // creates new contest game
        return contestDatabase.createContestGame(game, bracketId);
    }

    /**
     * Updates contest game
     * @param authId - admin authorizing addition
     * @param game - game to be updated
     * @returns - error response or saved contest game
     */
    async updateContestGame(authId: string, game: ContestGame): Promise<APIResponse | ContestGame> {
        logger.verbose("Entering method reportGameScore()", {
            class: this.className,
            values: { authId, game },
        });

        // TODO: check if contest & bracket exists in organization
        // does organization exist
        const org = await organizationDatabase.findOrganizationByAdminId(authId);
        if (!org) {
            return APIResponse.NewNotFound(authId);
        }

        // Updates contest game
        return contestDatabase.patchContestGame(game, null);
    }

    /**
     * Shorter method to report game score and status
     * @param authId - admin authorizing report
     * @param stats - stats of game
     * @returns - error response or patched contest game
     */
    async reportGameScore(
        authId: string,
        stats: IContestGameReport
    ): Promise<APIResponse | ContestGame> {
        logger.verbose("Entering method reportGameScore()", {
            class: this.className,
            values: { authId, stats },
        });

        // TODO: check if contest & bracket exists in organization
        // does organization exist
        const org = await organizationDatabase.findOrganizationByAdminId(authId);
        if (!org) {
            return APIResponse.NewNotFound(authId);
        }

        // creates new game object with updated stats
        const game = new ContestGame(stats);

        // passed into patch request only changing stats
        return contestDatabase.patchContestGame(game, null);
    }

    /**
     * Finds all contest games under organization with given id
     * @param authId - admin id
     * @returns - error response or contest list
     */
    async findAllContestGames(authId: string): Promise<APIResponse | ContestGame[]> {
        logger.verbose("Entering method reportGameScore()", {
            class: this.className,
            values: { authId },
        });

        // does organization exist
        const org = await organizationDatabase.findOrganizationByAdminId(authId);
        if (!org) {
            return APIResponse.NewNotFound(authId);
        }

        return contestDatabase.findAllContestGames(org.getId());
    }
}
