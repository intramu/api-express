import format from "pg-format";
import { IBracketDatabase } from "../interfaces/IBracket";
import { IContestDatabase } from "../interfaces/IContest";
import { IDivisionDatabase } from "../interfaces/IDivision";
import { ITeamDatabase } from "../interfaces/ITeam";
import { ILeagueDatabase } from "../interfaces/ILeague";
import { Bracket } from "../models/competition/Bracket";
import { Contest } from "../models/competition/Contest";
import { Division } from "../models/competition/Division";
import { League } from "../models/competition/League";
import { Team } from "../models/Team";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";
import { ContestGame } from "../models/competition/ContestGame";
import { IContestGameDatabase } from "../interfaces/IContestGame";
import { PlayerSmall } from "../models/PlayerSmall";

export default class ContestDAO {
    private readonly className = this.constructor.name;

    /**
     * Creates new contest under organization with given id
     * @param contest - must not be null
     * @param orgId - must not be null
     * @returns - the saved contest
     * @throws - error when creating contest
     */
    async createContest(contest: Contest, orgId: string): Promise<Contest> {
        logger.verbose("Entering method createContest()", {
            class: this.className,
            values: { contest, orgId },
        });

        const sql =
            "INSERT INTO contest (NAME, VISIBILITY, STATUS, SEASON, TERM, YEAR, organization_Id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";

        return withClient(async (querier) => {
            const [response] = (
                await querier<IContestDatabase>(sql, [
                    contest.getName(),
                    contest.getVisibility(),
                    contest.getStatus(),
                    contest.getSeason(),
                    contest.getTerm(),
                    contest.getYear(),
                    orgId,
                    // contest.getOrganizationId(),
                ])
            ).rows;

            if (!response) {
                logger.error("Error creating contest", {
                    class: this.className,
                });
                throw new Error("Error creating contest");
            }

            return Contest.fromDatabase({ ...response, leagues: [] });
        });
    }

    /**
     * Creates leagues, divisions, and brackets under contest with given id
     * @param leagues - list of leagues with divisions and brackets
     * @param contestId - must not be null
     * @returns - void
     */
    async createLeaguesAndChildren(leagues: League[], contestId: number): Promise<void> {
        /**
         * Due to the nested nature of this data, there will many queries on the database
         * A single connection is used to enter all data into the database, preventing
         *
         * the need to drop and acquire connections for every object
         * REVISIT - IF NEEDED, possibly use common table expressions to speed this up
         */
        logger.verbose("Entering method createLeaguesAndChildren()", {
            class: this.className,
            values: { leagues, contestId },
        });

        const sqlLeague =
            "INSERT INTO league (NAME, SPORT, contest_ID) VALUES ($1, $2, $3) RETURNING *";

        const sqlDivision =
            "INSERT INTO division (NAME, TYPE, LEVEL, STATUS, MAX_TEAM_SIZE, MIN_WOMEN_COUNT, MIN_MEN_COUNT, START_DATE, END_DATE, REGISTRATION_START_DATE, REGISTRATION_END_DATE, CONTEST_TYPE, PLAYOFF_TYPE, SEEDING_TYPE, league_ID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *";

        const sqlBracket =
            "INSERT INTO bracket (DAY_CHOICES, MAX_TEAM_AMOUNT, TIME_CHOICES, division_ID) VALUES ($1, $2, $3, $4) RETURNING *";

        const result = await withClientRollback(async (querier) => {
            // i'm not feeling this. It causes a lot of query operations on the database
            // won't be run that often. Creating leagues only happens twice a semester at
            // GCU at least. Fetching this list on the other hand may be slow. We will see

            // foreach league we enter in the details then use the returned id to enter
            // in divisions. This pattern continues all the way down the tree to the
            // timeslots for brackets
            leagues.forEach(async (league) => {
                const [returnedLeague] = (
                    await querier(sqlLeague, [league.getName(), league.getSport(), contestId])
                ).rows;

                if (!returnedLeague) {
                    return IsRollback;
                }

                return league.getDivisions().forEach(async (division) => {
                    const [returnedDivision] = (
                        await querier(sqlDivision, [
                            division.getName(),
                            division.getType(),
                            division.getLevel(),
                            division.getStatus(),
                            division.getMaxTeamSize(),
                            division.getMinWomenCount(),
                            division.getMinMenCount(),
                            division.getStartDate(),
                            division.getEndDate(),
                            division.getRegistrationStartDate(),
                            division.getRegistrationEndDate(),
                            division.getContestType(),
                            division.getPlayoffType(),
                            division.getPlayoffSeedingType(),
                            returnedLeague.id,
                        ])
                    ).rows;

                    if (!returnedDivision) {
                        return IsRollback;
                    }

                    return division.getBrackets().forEach(async (bracket) => {
                        // console.log(bracket.convertTimeSlotsToDatabaseFormat());

                        const [returnedBracket] = (
                            await querier(sqlBracket, [
                                bracket.getDayChoices(),
                                bracket.getMaxTeamAmount(),
                                [],
                                returnedDivision.id,
                            ])
                        ).rows;

                        if (!returnedBracket) {
                            return IsRollback;
                        }

                        return returnedBracket;
                    });
                });
            });

            return true;
        });

        if (result === IsRollback) {
            logger.error("Error creating leagues with children", {
                class: this.className,
            });
            throw new Error("Error creating leagues with children");
        }
    }

    /**
     * Creates contest game under bracket with given id
     * @param game - must not be null
     * @param bracketId - id of bracket; must not be null
     * @returns - the saved contest
     * @throws - error when creating contest game
     */
    async createContestGame(game: ContestGame, bracketId: number): Promise<ContestGame> {
        logger.verbose("Entering method createContestGame()", {
            class: this.className,
            values: { game, bracketId },
        });

        const sql =
            "INSERT INTO contest_game (GAME_DATE, SCORE_HOME, SCORE_AWAY, STATUS_HOME, STATUS_AWAY, location_ID, HOME_TEAM_ID, AWAY_TEAM_ID, bracket_ID) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";

        return withClient(async (querier) => {
            const [response] = (
                await querier<IContestGameDatabase>(sql, [
                    game.getGameDate(),
                    game.getScoreHome(),
                    game.getScoreAway(),
                    game.getStatusHome(),
                    game.getStatusAway(),
                    game.getLocation(),
                    game.getHomeTeam(),
                    game.getAwayTeam(),
                    bracketId,
                ])
            ).rows;

            if (!response) {
                logger.error("Error creating Contest Game", {
                    class: this.className,
                });
                throw new Error("Error creating Contest Game");
            }

            return ContestGame.fromDatabase(response);
        });
    }

    /**
     * Finds all leagues under a contest along with its children
     * @param contestId - id to fetch leagues with
     * @returns - returns list of leagues, division, and brackets
     */
    async findLeaguesAndChildrenByContestId(contestId: number): Promise<League[]> {
        // REVISIT - IF NEEDED, look at using json_build_object() or something of the sort to
        // get the database to perform a single query and return a built json object
        // refer to findPathByBracketId() for example
        logger.verbose("Entering method findLeaguesAndChildrenByContestId()", {
            class: this.className,
            values: contestId,
        });

        const sqlLeague = "SELECT * FROM league WHERE contest_id = $1";
        const sqlDivision = "SELECT * FROM division WHERE league_id IN (%L)";
        const sqlBracket = "SELECT * FROM bracket WHERE division_id IN (%L)";
        // const sqlTimeSlot = "SELECT * FROM bracket_time_slots WHERE bracket_id IN (%L)";
        const sql = `SELECT t.*,
            json_agg(json_build_object('auth_id', p.auth_id, 'first_name', p.first_name, 'last_name', p.last_name, 'gender', p.gender, 'status', p.status, 'image', p.image, 'role', tr.role)) AS players
            FROM team t
            JOIN team_roster AS tr ON t.id = tr.team_id
            JOIN player AS p ON p.auth_id = tr.player_auth_id
            WHERE t.bracket_id in (%L)
            GROUP BY(t.id)`;

        const sqlwhat = `SELECT t.*,
            COALESCE(json_agg(json_build_object('auth_id', p.auth_id, 'first_name', p.first_name, 'last_name', p.last_name, 'gender', p.gender, 'status', p.status, 'image', p.image, 'role', tr.role)) FILTER (WHERE p.auth_id IS NOT NULL), '[]') AS players
            FROM team t
            JOIN team_roster AS tr ON t.id = tr.team_id
            JOIN player AS p ON p.auth_id = tr.player_auth_id
            WHERE t.bracket_id = $1
            GROUP BY(t.id)`;
        const sqlTeams = "SELECT * FROM team WHERE bracket_id IN (%L)";

        // set of queries creates lists of leagues, divisions, and brackets that are unsorted
        const result = await withClientRollback(async (querier) => {
            const leagues = (await querier<ILeagueDatabase>(sqlLeague, [contestId])).rows;

            if (leagues.length === 0) {
                return IsRollback;
            }

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
            console.log(bracketIdList);

            const teams = (await querier<ITeamDatabase>(format(sql, bracketIdList))).rows;
            // const wow = (await querier<ITeamDatabase>(sqlwhat, [6])).rows;
            // console.log(wow);

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
                                            players: team.players.map((player) =>
                                                PlayerSmall.fromDatabase(player)
                                            ),
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
            logger.error("Rolledback");
            return [];
        }
        return result;
    }

    /**
     * Retrieves contest by its id
     * @param contestId - must not be null
     * @returns - contest with given id or null if not found
     */
    async findContestById(contestId: number): Promise<Contest | null> {
        logger.verbose("Entering method findContestById()", {
            class: this.className,
            values: contestId,
        });

        const sqlFind = "SELECT * FROM contest WHERE id = $1";
        return withClient(async (querier) => {
            const [contest] = (await querier<IContestDatabase>(sqlFind, [contestId])).rows;

            if (!contest) {
                return null;
            }

            return Contest.fromDatabase({ ...contest, leagues: [] });
        });
    }

    /**
     * Retrieves contest list under organization with given id
     * @param orgId - must not be null
     * @returns - contest list with given id
     */
    async findContestsByOrganizationId(orgId: string): Promise<Contest[]> {
        logger.verbose("Entering method findContestByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const sqlFind = "SELECT * FROM contest WHERE organization_id = $1";
        return withClient(async (querier) => {
            const contest = (await querier<IContestDatabase>(sqlFind, [orgId])).rows;

            return contest.map((result) => Contest.fromDatabase({ ...result, leagues: [] }));
        });
    }

    /**
     * Retrieves contest by contest id and organization id
     * @param contestId - must not be null
     * @param orgId - must not be null
     * @returns - contest with given id or null if not found
     */
    async findContestByIdAndOrgId(contestId: number, orgId: string): Promise<Contest | null> {
        logger.verbose("Entering method findContestByIdAndOrgId()", {
            class: this.className,
            values: { orgId, contestId },
        });

        const sqlFind = "SELECT * FROM contest WHERE id = $1 AND organization_id = $2";

        return withClient(async (querier) => {
            const [contest] = (await querier<IContestDatabase>(sqlFind, [contestId, orgId])).rows;

            if (!contest) {
                return null;
            }

            return Contest.fromDatabase({ ...contest, leagues: [] });
        });
    }

    /**
     * Retrieves bracket by its id
     * @param bracketId - must not be null
     * @returns - bracket with given id or null if not found
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
     * Retrieves division by its id
     * @param divisionId - must not be null
     * @returns - division with given id or null if not found
     */
    async findDivisionById(divisionId: number): Promise<Division | null> {
        logger.verbose("Entering method findDivisionById()", {
            class: this.className,
            values: divisionId,
        });

        const sqlDivision = "SELECT * FROM division WHERE id = $1";
        const sqlBrackets = "SELECT * FROM bracket WHERE division_id = $1";

        const result = await withClientRollback(async (querier) => {
            const [division] = (await querier<IDivisionDatabase>(sqlDivision, [divisionId])).rows;
            const brackets = (await querier<IBracketDatabase>(sqlBrackets, [divisionId])).rows;

            if (!division) {
                return IsRollback;
            }

            const bracketList = brackets.map((bracket) =>
                Bracket.fromDatabase({ ...bracket, teams: [] })
            );

            return Division.fromDatabase({
                ...division,
                brackets: bracketList,
            });
        });

        if (result === IsRollback) {
            return null;
        }

        return result;
    }

    /**
     * This method returns the path through the contest, league, division, bracket, and
     * teams, along with all their details. Uses table joins and json functions and
     * operators
     *
     * @param bracketId - must not be null
     * @returns - contest object with the tree to the bracket or null if not found
     */
    async findPathByBracketId(bracketId: number): Promise<Contest | null> {
        logger.verbose("Entering method findPathByBracketId()", {
            class: this.className,
            values: bracketId,
        });

        // kept here for reference
        // COALESCE(json_agg (json_build_object('name', t.name)) FILTER (WHERE t.id IS NOT NULL), '[]') AS teams

        const sqlFind = `SELECT b.id AS bracket_id, b.*, 
        d.id AS division_id, d.name AS division_name, d.status AS division_status, d.*, 
        l.id AS league_id, l.name AS league_name, l.*, 
        c.id AS contest_id, c.name AS contest_name, c.*, 
        COALESCE(json_agg (t) FILTER (WHERE t.id IS NOT NULL), '[]') AS teams 
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

            const teams = res.teams.map((team: ITeamDatabase) =>
                Team.fromDatabase({ ...team, players: [] })
            );

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
                status: res.division_status,
                max_team_size: res.max_team_size,
                min_women_count: res.min_women_count,
                min_men_count: res.min_men_count,
                start_date: res.start_date,
                end_date: res.end_date,
                registration_start_date: res.registration_start_date,
                registration_end_date: res.registration_end_date,
                contest_type: res.contest_type,
                playoff_type: res.playoff_type,
                playoff_seeding_type: res.playoff_seeding_type,
                brackets: [bracket],
            });

            const league = League.fromDatabase({
                id: res.league_id,
                name: res.league_name,
                sport: res.sport,
                divisions: [division],
            });

            return Contest.fromDatabase({
                id: res.contest_id,
                name: res.contest_name,
                visibility: res.visibility,
                status: res.status,
                season: res.season,
                term: res.term,
                year: res.year,
                date_created: res.date_created,
                leagues: [league],
            });
        });
    }

    /**
     * Finds contest games under organization id
     * @param orgId - must not be null
     * @returns contest game list with given id or null if not found
     */
    async findAllContestGames(orgId: string): Promise<ContestGame[]> {
        logger.verbose("Entering method findAllContestGames()", {
            class: this.className,
        });

        /**
         * Selects all games that exist within organization
         * Traverses to the games through teams by table joins
         * Then joins teams and location to create game object
         */
        const newSql = `SELECT g.*,
        row_to_json (h) AS home_team,
        row_to_json (a) AS away_team,
        row_to_json (l) AS location
        FROM contest_game g
        INNER JOIN team AS h ON g.home_team_id = h.id
        INNER JOIN team AS a ON g.away_team_id = a.id
        INNER JOIN location AS l ON l.id = g.location_id
        JOIN team t on t.id = g.home_team_id
        JOIN organization o on o.id = t.organization_id
        WHERE o.id = $1`;

        return withClient(async (querier) => {
            const response = (await querier<IContestGameDatabase>(newSql, [orgId])).rows;

            return response.map((game) => ContestGame.fromDatabase(game));
        });
    }

    /**
     * Patches admin in database
     * @param game - must not be null
     * @param bracketId - id of bracket; can be null
     * @returns - the update contest game
     */
    async patchContestGame(game: ContestGame, bracketId: number | null): Promise<ContestGame> {
        logger.verbose("Entering method updateContestGame()", {
            class: this.className,
            values: { game, bracketId },
        });

        const homeStatus = game.getStatusHome() === 0 ? null : game.getStatusHome();
        const awayStatus = game.getStatusAway() === 0 ? null : game.getStatusAway();
        const location = game.getLocation().getId() === 0 ? null : game.getLocation().getId();
        const homeTeam = game.getHomeTeam().getId() === 0 ? null : game.getHomeTeam().getId();
        const awayTeam = game.getAwayTeam().getId() === 0 ? null : game.getAwayTeam().getId();

        const sql = `UPDATE contest_game 
        SET game_date=COALESCE($1, game_date), score_home=COALESCE($2, score_home), score_away=COALESCE($3, score_away), status_home=COALESCE($4, status_home), status_away=COALESCE($5, status_away), location_id=COALESCE($6, location_id), home_team_id=COALESCE($7, home_team_id), away_team_id=COALESCE($8, away_team_id), bracket_id=COALESCE($9, bracket_id) 
        WHERE id = $10 RETURNING *`;

        return withClient(async (querier) => {
            const [response] = (
                await querier<IContestGameDatabase>(sql, [
                    game.getGameDate(),
                    game.getScoreHome(),
                    game.getScoreAway(),
                    homeStatus,
                    awayStatus,
                    location,
                    homeTeam,
                    awayTeam,
                    bracketId,
                    game.getId(),
                ])
            ).rows;

            return ContestGame.fromDatabase(response);
        });
    }
}

const test = new ContestDAO();

async function testFunction() {
    // console.log(await test.findAllContestGames("dab32727-cb7c-4320-8865-6f1b842785ed"));
    // const find = await test.findPathByBracketId(2);
    // const list = await test.findLeaguesAndChildrenByContestId(2);
    // console.log(list);
    // console.log(list[0].getDivisions()[0].getBrackets()[1].getTeams()[0]);
    // console.log(find?.getLeagues()[0].getDivisions()[0].getBrackets()[0].getTimeChoices());
}

testFunction();
