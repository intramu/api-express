import format from "pg-format";
import { IBracketDatabase } from "../interfaces/Bracket";
import { IContestDatabase } from "../interfaces/Contest";
import { IDivisionDatabase } from "../interfaces/Division";
import { ITeamDatabase } from "../interfaces/ITeam";
import { ILeagueDatabase } from "../interfaces/League";
import { Bracket } from "../models/competition/Bracket";
import { Contest } from "../models/competition/Contest";
import { Division } from "../models/competition/Division";
import { League } from "../models/competition/League";
import { Team } from "../models/Team";
import { TeamGender } from "../utilities/enums/teamEnum";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";

export default class ContestDAO {
    private readonly className = this.constructor.name;

    /**
     * Creates new contest to setup league play
     * @param contest - contest details to be added to database
     * @returns - returns contest details or null
     */
    async createContest(contest: Contest, orgId: string): Promise<Contest> {
        logger.verbose("Entering method createContest()", {
            class: this.className,
            values: { contest, orgId },
        });

        const sqlAdd =
            "INSERT INTO contest (NAME, VISIBILITY, STATUS, START_DATE, END_DATE, PLAYOFF, PLAYOFF_TYPE, PLAYOFF_SEEDING_TYPE, CONTEST_TYPE, organization_Id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";

        return withClient(async (querier) => {
            const [result] = (
                await querier<IContestDatabase>(sqlAdd, [
                    contest.getName(),
                    contest.getVisibility(),
                    contest.getStatus(),
                    contest.getStartDate(),
                    contest.getEndDate(),
                    contest.getPlayoff(),
                    contest.getPlayoffType(),
                    contest.getPlayoffSeedingType(),
                    contest.getContestType(),
                    orgId,
                    // contest.getOrganizationId(),
                ])
            ).rows;

            if (result === undefined) {
                logger.error("Error creating contest", {
                    class: this.className,
                });
                throw new Error("Error creating contest");
            }

            return Contest.fromDatabase(result);
        });
    }

    /**
     * Due to the nested nature of this data, there will many queries on the database
     * A single connection is used to enter all data into the database, preventing
     * the need to drop and acquire connections for every object
     *
     * REVISIT - IF NEEDED, possibly use common table expressions to speed this up
     *
     * @param leagues - list of leagues with divisions and brackets
     * @param orgId - organization to create leagues under, ? may not be needed in future
     * @param contestId - contest to put leagues under
     * @returns - returns true or false for success and failure
     */
    async createLeaguesAndChildren(
        leagues: League[],
        orgId: string,
        contestId: number
    ): Promise<boolean> {
        logger.verbose("Entering method createLeaguesAndChildren()", {
            class: this.className,
            values: { leagues, orgId, contestId },
        });

        const sqlLeague =
            "INSERT INTO league (NAME, SPORT, START_DATE, END_DATE, contest_ID, organization_ID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

        const sqlDivision =
            "INSERT INTO division (NAME, TYPE, LEVEL, MAX_TEAM_SIZE, MIN_WOMEN_COUNT, MIN_MEN_COUNT, league_ID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

        const sqlBracket =
            "INSERT INTO bracket (DAY_CHOICES, MAX_TEAM_AMOUNT, division_ID) VALUES ($1, $2, $3) RETURNING *";

        const result = await withClientRollback(async (querier) => {
            // i'm not feeling this. It causes a lot of query operations on the database
            // won't be run that often. Creating leagues only happens twice a semester at
            // GCU at least. Fetching this list on the other hand may be slow. We will see

            // foreach league we enter in the details then use the returned id to enter
            // in divisions. This pattern continues all the way down the tree to the
            // timeslots for brackets
            leagues.forEach(async (league) => {
                const [returnedLeague] = (
                    await querier(sqlLeague, [
                        league.getName(),
                        league.getSport(),
                        league.getStartDate(),
                        league.getEndDate(),
                        contestId,
                        orgId,
                    ])
                ).rows;

                if (returnedLeague === undefined) {
                    return IsRollback;
                }

                return league.getDivisions().forEach(async (division) => {
                    const [returnedDivision] = (
                        await querier(sqlDivision, [
                            division.getName(),
                            division.getType(),
                            division.getLevel(),
                            division.getMaxTeamSize(),
                            division.getMinWomenCount(),
                            division.getMinMenCount(),
                            returnedLeague.id,
                        ])
                    ).rows;

                    if (returnedDivision === undefined) {
                        return IsRollback;
                    }

                    return division.getBrackets().forEach(async (bracket) => {
                        const [returnedBracket] = (
                            await querier(sqlBracket, [
                                bracket.getDayChoices(),
                                bracket.getMaxTeamAmount(),
                                returnedDivision.id,
                            ])
                        ).rows;

                        if (returnedBracket === undefined) {
                            return IsRollback;
                        }

                        return returnedBracket;
                    });
                });
            });

            return true;
        });

        if (result === IsRollback) {
            return false;
        }

        return result;
    }

    /**
     * Finds all leagues under a contest along with its children
     *
     * REVISIT - IF NEEDED, look at using json_build_object() or something of the sort to
     * get the database to perform a single query and return a built json object
     * refer to findPathByBracketId() for example
     *
     * @param contestId - id to fetch leagues with
     * @returns - returns list of leagues, division, and brackets
     */
    async findLeaguesAndChildrenByContestId(contestId: number): Promise<League[]> {
        logger.verbose("Entering method findLeaguesAndChildrenByContestId()", {
            class: this.className,
            values: contestId,
        });

        const sqlLeague = "SELECT * FROM league WHERE contest_id = $1";
        const sqlDivision = "SELECT * FROM division WHERE league_id IN (%L)";
        const sqlBracket = "SELECT * FROM bracket WHERE division_id IN (%L)";
        // const sqlTimeSlot = "SELECT * FROM bracket_time_slots WHERE bracket_id IN (%L)";
        const sqlTeams = "SELECT * FROM team WHERE bracket_id IN (%L)";

        // set of queries creates lists of leagues, divisions, and brackets that are unsorted
        const result = await withClientRollback(async (querier) => {
            const leagues = (await querier<ILeagueDatabase>(sqlLeague, [contestId])).rows;

            // fetch divisions based on league ids
            const leagueIdList = leagues.map((x) => x.id);
            const divisions = (await querier<IDivisionDatabase>(format(sqlDivision, leagueIdList)))
                .rows;

            // fetch brackets based on division ids
            const divisionIdList = divisions.map((x) => x.id);
            const brackets = (await querier<IBracketDatabase>(format(sqlBracket, divisionIdList)))
                .rows;

            // fetch timeSlots based on bracket ids
            const bracketIdList = brackets.map((x) => x.id);
            // const timeSlots = (await querier(format(sqlTimeSlot, bracketIdList)))
            //     .rows;

            // fetch all Teams that are part of bracket
            const teams = (await querier<ITeamDatabase>(format(sqlTeams, bracketIdList))).rows;

            if (leagues.length === 0) {
                return IsRollback;
            }

            /** My thought process here was to reverse the process for the insert function
             * above. The insert relies on querying the database for every single league, division,
             * bracket, etc. With this method it only queries once for each object, then
             * relies on server power to sort the results into objects. This retrieve
             * function is going to be used a lot, so we will keep an eye on its performance
             */
            const formattedLeagues = leagues.map((league) => {
                const divisionList = divisions
                    // every division is sorted out first by checking if the foreign key
                    // on the division matches the league id
                    // this pattern continues for the other objects
                    .filter((division) => division.league_id === league.id)
                    .map((division) => {
                        //
                        // Map out list of brackets for each division
                        const bracketList = brackets
                            .filter((bracket) => bracket.division_id === division.id)
                            .map((bracket) => {
                                //
                                // Map out list of teams for each bracket
                                const teamList = teams
                                    .filter((team) => team.bracket_id === bracket.id)
                                    .map((team) =>
                                        Team.fromDatabase({
                                            ...team,
                                            players: [],
                                        })
                                    );

                                return Bracket.fromDatabase({ ...bracket, teams: teamList });
                            });

                        return Division.fromDatabase({ ...division, brackets: bracketList });
                    });

                return League.fromDatabase({ ...league, divisions: divisionList });
            });

            return formattedLeagues;
        });

        if (result === IsRollback) {
            return [];
        }
        return result;
    }

    /**
     * Returns contest details by using the id
     * @param contestId - id to search for contest
     * @returns - contest object or null
     */
    async findContestById(contestId: number): Promise<Contest | null> {
        logger.verbose("Entering method findContest()", {
            class: this.className,
            values: contestId,
        });

        const sqlFind = "SELECT * FROM contest WHERE id = $1";
        return withClient(async (querier) => {
            const [contest] = (await querier<IContestDatabase>(sqlFind, [contestId])).rows;

            if (contest === undefined) {
                return null;
            }

            return new Contest({
                id: contest.id,
                name: contest.name,
                visibility: contest.visibility,
                status: contest.status,
                dateCreated: contest.date_created,
                startDate: contest.start_date,
                endDate: contest.end_date,
                playoff: contest.playoff,
                playoffType: contest.playoff_type,
                playoffSeedingType: contest.playoff_seeding_type,
                contestType: contest.contest_type,
                leagues: [],
                organizationId: contest.organization_id,
            });
        });
    }

    /**
     * Returns bracket object
     * @param bracketId - id to search for bracket with
     * @returns - Bracket object or null
     */
    async findBracketById(bracketId: number): Promise<Bracket | null> {
        logger.verbose("Entering method findBracketById()", {
            class: this.className,
            values: bracketId,
        });

        const sqlBracket = "SELECT * FROM bracket WHERE id = $1";

        return withClient(async (querier) => {
            const [bracket] = (await querier<IBracketDatabase>(sqlBracket, [bracketId])).rows;

            return Bracket.fromDatabase({ ...bracket, teams: [] });
        });
    }

    /**
     * This method returns the path through the contest, league, division, bracket, and
     * teams, along with all their details. Uses table joins and json functions and
     * operators
     *
     * @param bracketId - Bracket id to search with
     * @returns - returns a Contest object with the tree to the bracket
     */
    async findPathByBracketId(bracketId: number): Promise<Contest | null> {
        logger.verbose("Entering method findPathByBracketId()", {
            class: this.className,
            values: bracketId,
        });

        // kept here for reference
        // COALESCE(json_agg (json_build_object('name', t.name)) FILTER (WHERE t.id IS NOT NULL), '[]') AS teams

        const sqlFind = `SELECT b.id AS bracket_id, b.*, 
        d.id AS division_id, d.name AS division_name, d.*, 
        l.id AS league_id, l.name AS league_name, l.start_date AS league_start_date, l.end_date AS league_end_date, l.*, 
        c.id AS contest_id, c.name AS contest_name, c.start_date AS contest_start_date, c.end_date AS contest_end_date, c.*, COALESCE(json_agg (t) FILTER (WHERE t.id IS NOT NULL), '[]') AS teams 
        FROM bracket b 
        LEFT JOIN team t ON t.bracket_id = b.id
        JOIN division d ON b.division_id = d.id
        JOIN league l ON d.league_id = l.id 
        JOIN contest c ON l.contest_id = c.id
        WHERE b.id = $1
        GROUP BY b.id, d.id, l.id, c.id`;

        return withClient(async (querier) => {
            const [res] = (await querier(sqlFind, [bracketId])).rows;

            if (res === undefined) {
                return null;
            }

            const teams = res.teams.map((team: ITeamDatabase) => {
                return Team.fromDatabase({ ...team, players: [] });
            });

            const bracket = Bracket.fromDatabase({
                id: res.bracket_id,
                day_choices: res.day_choices,
                max_team_amount: res.max_team_amount,
                time_choices: res.time_choices,
                teams,
            });

            const division = Division.fromDatabase({
                id: res.division_id,
                name: res.division_name,
                type: res.type,
                level: res.level,
                max_team_size: res.max_team_size,
                min_women_count: res.min_women_count,
                min_men_count: res.min_men_count,
                brackets: [bracket],
            });

            const league = League.fromDatabase({
                id: res.league_id,
                name: res.league_name,
                sport: res.sport,
                start_date: res.league_start_date,
                end_date: res.league_end_date,
                divisions: [division],
            });

            return Contest.fromDatabase({
                id: res.contest_id,
                name: res.contest_name,
                visibility: res.visibility,
                status: res.status,
                date_created: res.date_created,
                start_date: res.contest_start_date,
                end_date: res.contest_end_date,
                playoff: res.playoff,
                playoff_type: res.playoff_type,
                playoff_seeding_type: res.playoff_seeding_type,
                contest_type: res.contest_type,
                leagues: [league],
            });
        });
    }
}

const test = new ContestDAO();

async function testFunction() {
    console.log(await test.findPathByBracketId(1));
}

testFunction();
