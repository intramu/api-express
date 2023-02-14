import format from "pg-format";
import { BracketDatabaseInterface } from "../interfaces/Bracket";
import { ContestDatabaseInterface } from "../interfaces/Contest";
import { LeagueDatabaseInterface } from "../interfaces/League";
import { Bracket } from "../models/competition/Bracket";
import { Contest } from "../models/competition/Contest";
import { Division } from "../models/competition/Division";
import { League } from "../models/competition/League";
import { TimeSlot } from "../models/competition/TimeSlot";
import { Tournament } from "../models/competition/Tournament";
import { TournamentGame } from "../models/competition/TournamentGame";
import { Team } from "../models/Team";
import { TournamentGameStatus } from "../utilities/enums/competitionEnum";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";

export default class CompetitionDAO {
    private readonly className = this.constructor.name;

    /**
     * Will create new tournament object in database without games
     * @param tournament - tournament object to be added to database
     * @returns - returns the tournament details or null
     */
    async createTournament(tournament: Tournament): Promise<Tournament | null> {
        logger.verbose("Entering method createTournament()", {
            class: this.className,
            values: tournament,
        });

        const sqlAdd =
            "INSERT INTO tournament (NAME, VISIBILITY, STATUS, NUMBER_OF_TEAMS, START_DATE, END_DATE, TOURNAMENT_TYPE, SPORT, organization_ID) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *";

        return withClient(async (querier) => {
            const response = await querier(sqlAdd, [
                tournament.getName(),
                tournament.getVisibility(),
                tournament.getStatus(),
                tournament.getNumberOfTeams(),
                tournament.getStartDate(),
                tournament.getEndDate(),
                tournament.getTournamentType(),
                tournament.getSport(),
                tournament.getOrganizationId(),
            ]);
            const [results] = response.rows;

            if (results === undefined) {
                return null;
            }

            return new Tournament({
                id: results.id,
                name: results.name,
                visibility: results.visibility,
                status: results.status,
                numberOfTeams: results.number_of_teams,
                dateCreated: results.date_created,
                startDate: results.start_date,
                endDate: results.end_date,
                tournamentType: results.tournament_type,
                sport: results.sport,
                games: [],
                organizationId: results.organization_id,
            });
        });
    }

    /**
     * Returns list of games in tournament
     * @param tournamentId - id to search by
     * @returns - Tournament details or null
     */
    async findTournamentByIdWithGames(tournamentId: number): Promise<Tournament | null> {
        logger.verbose("Entering method findTournamentId()", {
            class: this.className,
            values: tournamentId,
        });

        const sqlFind = "SELECT * FROM tournament WHERE id = $1";
        const sqlGames = "SELECT * FROM tournament_game WHERE tournament_id = $1";

        return withClient(async (querier) => {
            const responseTwo = await querier(sqlFind, [tournamentId]);
            const [tournament] = responseTwo.rows;

            if (tournament === undefined) {
                return null;
            }

            const responseOne = await querier(sqlGames, [tournamentId]);
            const resultsOne = responseOne.rows;

            if (resultsOne === undefined) {
                return null;
            }

            const gameList = resultsOne.map(
                (game) =>
                    new TournamentGame({
                        id: game.id,
                        dateCreated: game.date_created,
                        gameDate: game.game_date,
                        location: game.location,
                        locationDetails: game.location_details,
                        scoreHome: game.score_home,
                        scoreAway: game.score_away,
                        seedHome: game.seed_home,
                        seedAway: game.seed_away,
                        statusHome: game.status_home,
                        statusAway: game.status_away,
                        level: game.level,
                        round: game.round,
                        homeTeamId: game.home_team_id,
                        awayTeamId: game.away_team_id,
                        tournamentId: game.tournament_id,
                    })
            );

            return new Tournament({
                id: tournament.id,
                name: tournament.name,
                visibility: tournament.visibility,
                status: tournament.status,
                numberOfTeams: tournament.number_of_teams,
                dateCreated: tournament.date_created,
                startDate: tournament.start_date,
                endDate: tournament.end_date,
                tournamentType: tournament.tournament_type,
                sport: tournament.sport,
                games: gameList,
                organizationId: tournament.organization_id,
            });
        });
    }

    /**
     * Patches tournament details rather than completely updating object
     * @param tournament - tournament details to be changed
     * @returns - updated tournament details
     */
    async patchTournament(tournament: Tournament): Promise<Tournament | null> {
        logger.verbose("Entering method createTournamentGame()", {
            class: this.className,
            values: tournament,
        });

        const sqlPatch =
            "UPDATE tournament SET name=COALESCE($1, name), visibility=COALESCE($2, visibility), status=COALESCE($3, status), number_of_teams=COALESCE($4, number_of_teams), start_date=COALESCE($5, start_date), end_date=COALESCE($6, end_date), tournament_type=COALESCE($7, tournament_type), sport($8, sport) RETURNING *";

        const name = tournament.getName() || null;
        const sport = tournament.getSport() || null;

        return withClient(async (querier) => {
            const response = await querier(sqlPatch, [
                name,
                tournament.getVisibility(),
                tournament.getStatus(),
                tournament.getNumberOfTeams(),
                tournament.getStartDate(),
                tournament.getEndDate(),
                tournament.getTournamentType(),
                sport,
            ]);
            const [results] = response.rows;
            if (results === undefined) {
                return null;
            }

            return new Tournament({
                id: results.id,
                name: results.name,
                visibility: results.visibility,
                status: results.status,
                numberOfTeams: results.number_of_teams,
                dateCreated: results.date_created,
                startDate: results.start_date,
                endDate: results.end_date,
                tournamentType: results.tournament_type,
                sport: results.sport,
                games: [],
                organizationId: results.organization_id,
            });
        });
    }

    /**
     * Adds new tournament games to an existing tournament
     * @param games - list of games that will be created in tournament
     * @returns - returns list of the games just added
     */
    async createTournamentGames(games: TournamentGame[]): Promise<TournamentGame[]> {
        logger.verbose("Entering method createTournamentGames()", {
            class: this.className,
            values: games,
        });

        const sqlAdd =
            "INSERT INTO tournament_game (GAME_DATE, LOCATION, LOCATION_DETAILS, SCORE_HOME, SCORE_AWAY, SEED_HOME, SEED_AWAY, STATUS_HOME, STATUS_AWAY, LEVEL, ROUND, HOME_TEAM_ID, AWAY_TEAM_ID, tournament_ID) VALUES %L RETURNING *";

        const values = games.map((game) => [
            game.getGameDate(),
            game.getLocation(),
            game.getLocationDetails(),
            game.getScoreHome(),
            game.getScoreAway(),
            game.getSeedHome(),
            game.getSeedAway(),
            game.getStatusHome(),
            game.getStatusAway(),
            game.getLevel(),
            game.getRound(),
            game.getHomeTeamId(),
            game.getAwayTeamId(),
            game.getTournamentId(),
        ]);

        return withClient(async (querier) => {
            const response = await querier(format(sqlAdd, values));
            const results = response.rows;
            console.log(results);

            if (results === undefined) {
                return [];
            }

            return results.map(
                (game) =>
                    new TournamentGame({
                        id: game.id,
                        dateCreated: game.date_created,
                        gameDate: game.game_date,
                        location: game.location,
                        locationDetails: game.location_details,
                        scoreHome: game.score_home,
                        scoreAway: game.score_away,
                        seedHome: game.seed_home,
                        seedAway: game.seed_away,
                        statusHome: game.status_home,
                        statusAway: game.status_away,
                        level: game.level,
                        round: game.round,
                        homeTeamId: game.home_team_id,
                        awayTeamId: game.away_team_id,
                        tournamentId: game.tournament_id,
                    })
            );
        });
    }

    /**
     * Creates new contest to setup league play
     * @param contest - contest details to be added to database
     * @returns - returns contest details or null
     */
    async createContest(contest: Contest): Promise<Contest | null> {
        logger.verbose("Entering method createContest()", {
            class: this.className,
            values: contest,
        });

        const sqlAdd =
            "INSERT INTO contest (NAME, VISIBILITY, STATUS, START_DATE, END_DATE, PLAYOFF, PLAYOFF_TYPE, PLAYOFF_SEEDING_TYPE, CONTEST_TYPE, organization_Id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";

        return withClient(async (querier) => {
            const [result] = (
                await querier(sqlAdd, [
                    contest.getName(),
                    contest.getVisibility(),
                    contest.getStatus(),
                    contest.getStartDate(),
                    contest.getEndDate(),
                    contest.getPlayoff(),
                    contest.getPlayoffType(),
                    contest.getPlayoffSeedingType(),
                    contest.getContestType(),
                    contest.getOrganizationId(),
                ])
            ).rows;

            if (contest === undefined) {
                return null;
            }

            return new Contest({
                id: result.id,
                name: result.name,
                visibility: result.visibility,
                status: result.status,
                dateCreated: result.date_created,
                startDate: result.start_date,
                endDate: result.end_date,
                playoff: result.playoff,
                playoffType: result.playoff_type,
                playoffSeedingType: result.playoff_seeding_type,
                contestType: result.contest_type,
                leagues: [],
                organizationId: result.organization_id,
            });
        });
    }

    /**
     * Creates new leagues without divisions or brackets
     * @param leagues - list of leagues to be created
     * @returns - returns list of leagues just created
     */
    async createLeagues(leagues: League[]): Promise<League[]> {
        logger.verbose("Entering method createLeagues()", {
            class: this.className,
            values: leagues,
        });

        const sqlAdd =
            "INSERT INTO league (NAME, SPORT, START_DATE, END_DATE, contest_ID, organization_ID) VALUES %L RETURNING *";

        const values = leagues.map((league) => [
            league.getName(),
            league.getSport(),
            league.getStartDate(),
            league.getEndDate(),
            league.getContestId(),
            league.getOrganizationId(),
        ]);

        return withClient(async (querier) => {
            const results = (await querier(format(sqlAdd, values))).rows;

            if (results.length === 0) {
                return [];
            }

            return results.map(
                (league) =>
                    new League({
                        id: league.id,
                        name: league.name,
                        sport: league.sport,
                        startDate: league.start_date,
                        endDate: league.end_date,
                        divisions: [],
                        contestId: league.contest_id,
                        organizationId: league.organization_id,
                    })
            );
        });
    }

    /**
     * Due to the nested nature of this data, there will many queries on the database
     * A single connection is used to enter all data into the database, preventing
     * the need to drop and acquire connections for every object
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
        logger.verbose("Entering method createFullLeagues()", {
            class: this.className,
            values: leagues,
        });

        const sqlLeague =
            "INSERT INTO league (NAME, SPORT, START_DATE, END_DATE, contest_ID, organization_ID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

        const sqlDivision =
            "INSERT INTO division (NAME, TYPE, LEVEL, MAX_TEAM_SIZE, MIN_WOMEN_COUNT, MIN_MEN_COUNT, league_ID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

        const sqlBracket =
            "INSERT INTO bracket (DAY_CHOICES, MAX_TEAM_AMOUNT, division_ID) VALUES ($1, $2, $3) RETURNING *";

        const sqlTimeSlot =
            "INSERT INTO bracket_time_slots (START_TIME, END_TIME, bracket_ID) VALUES ($1, $2, $3) RETURNING *";

        // const leagueValues: any = [];
        // const divisionValues: any = [];
        // const bracketValues: any = [];
        // const timeSlotValues: any = [];

        // leagues.forEach((league) => {
        //     leagueValues.push([
        //         league.getName(),
        //         league.getSport(),
        //         league.getStartDate(),
        //         league.getEndDate(),
        //         league.getContestId(),
        //         league.getOrganizationId(),
        //     ]);

        // league.getDivisions().forEach((division) => {
        //     divisionValues.push([
        //         division.getName(),
        //         division.getType(),
        //         division.getLevel(),
        //         division.getMaxTeamSize(),
        //         division.getMinWomenCount(),
        //         division.getMinMenCount(),
        //         division.getLeagueId(),
        //     ]);

        //     division.getBrackets().forEach((bracket) => {
        //         bracketValues.push([
        //             bracket.getDayChoices(),
        //             bracket.getMaxSize(),
        //             bracket.getDivisionId(),
        //         ]);

        //         bracket.getTimeSlots().forEach((timeSlot) => {
        //             timeSlotValues.push([
        //                 timeSlot.getStartTime(),
        //                 timeSlot.getEndTime(),
        //                 timeSlot.getBracketId(),
        //             ]);
        //         });
        //     });
        // });
        // });

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

                        return bracket.getTimeSlots().forEach(async (timeSlot) => {
                            const [returnedTimeSlot] = (
                                await querier(sqlTimeSlot, [
                                    timeSlot.getStartTime(),
                                    timeSlot.getEndTime(),
                                    returnedBracket.id,
                                ])
                            ).rows;

                            if (returnedTimeSlot === undefined) {
                                return IsRollback;
                            }

                            return returnedTimeSlot;
                        });
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
        const sqlTimeSlot = "SELECT * FROM bracket_time_slots WHERE bracket_id IN (%L)";
        const sqlTeams = "SELECT * FROM team WHERE bracket_id IN (%L)";

        // set of queries creates lists of leagues, divisions, and brackets that are unsorted
        const result = await withClientRollback(async (querier) => {
            const leagues = (await querier<LeagueDatabaseInterface>(sqlLeague, [contestId])).rows;

            // fetch divisions based on league ids
            const leagueIdList = leagues.map((x) => x.id);
            const divisions = (await querier(format(sqlDivision, leagueIdList))).rows;

            // fetch brackets based on division ids
            const divisionIdList = divisions.map((x) => x.id);
            const brackets = (await querier(format(sqlBracket, divisionIdList))).rows;

            // fetch timeSlots based on bracket ids
            const bracketIdList = brackets.map((x) => x.id);
            const timeSlots = (await querier(format(sqlTimeSlot, bracketIdList))).rows;

            // fetch all Teams that are part of bracket
            const teams = (await querier(format(sqlTeams, bracketIdList))).rows;

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
                        const bracketList = brackets
                            .filter((bracket) => bracket.division_id === division.id)
                            .map((bracket) => {
                                const timeSlotList = timeSlots
                                    .filter((timeSlot) => timeSlot.bracket_id === bracket.id)
                                    .map(
                                        (timeSlot) =>
                                            new TimeSlot({
                                                id: timeSlot.id,
                                                startTime: timeSlot.start_time,
                                                endTime: timeSlot.end_time,
                                                bracketId: timeSlot.bracket_id,
                                            })
                                    );
                                const teamList = teams
                                    .filter((team) => team.bracket_id === bracket.id)
                                    .map(
                                        (team) =>
                                            new Team({
                                                id: team.id,
                                                name: team.name,
                                                wins: team.wins,
                                                ties: team.ties,
                                                losses: team.losses,
                                                image: team.image,
                                                visibility: team.visibility,
                                                sport: team.sport,
                                                dateCreated: team.date_created,
                                                sportsmanshipScore: team.sportsmanship_score,
                                                status: team.status,
                                                maxTeamSize: team.max_team_size,
                                                players: [],
                                                organizationId: team.organization_id,
                                                bracketId: null,
                                            })
                                    );

                                return new Bracket({
                                    id: bracket.id,
                                    dayChoices: bracket.day_choices,
                                    timeSlots: timeSlotList,
                                    maxTeamAmount: bracket.max_team_amount,
                                    teams: teamList,
                                    divisionId: bracket.division_id,
                                });
                            });

                        return new Division({
                            id: division.id,
                            name: division.name,
                            type: division.type,
                            level: division.level,
                            maxTeamSize: division.max_team_size,
                            minMenCount: division.min_men_count,
                            minWomenCount: division.min_women_count,
                            brackets: bracketList,
                            leagueId: division.league_id,
                        });
                    });

                return new League({
                    id: league.id,
                    name: league.name,
                    sport: league.sport,
                    startDate: league.start_date,
                    endDate: league.end_date,
                    divisions: divisionList,
                    contestId: league.contest_id,
                    organizationId: league.organization_id,
                });
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
            const [contest] = (await querier<ContestDatabaseInterface>(sqlFind, [contestId])).rows;

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
     * Returns bracket object along with timeslots
     * @param bracketId - id to search for bracket with
     * @returns - Bracket object or null
     */
    async findBracketById(bracketId: number): Promise<Bracket | null> {
        logger.verbose("Entering method findBracketById()", {
            class: this.className,
            values: bracketId,
        });

        const sqlBracket = "SELECT * FROM bracket WHERE id = $1";
        const sqlTime = "SELECT * FROM bracket_time_slots WHERE bracket_id = $1";

        const result = await withClientRollback(async (querier) => {
            const [bracket] = (await querier<BracketDatabaseInterface>(sqlBracket, [bracketId]))
                .rows;

            if (bracket === undefined) {
                return IsRollback;
            }
            const timeSlots = (await querier(sqlTime, [bracket.id])).rows.map((timeSlot) => {
                return new TimeSlot({
                    id: timeSlot.id,
                    startTime: timeSlot.start_time,
                    endTime: timeSlot.end_time,
                    bracketId: timeSlot.bracket_id,
                });
            });

            return new Bracket({
                id: bracket.id,
                dayChoices: bracket.day_choices,
                divisionId: bracket.division_id,
                maxTeamAmount: bracket.max_team_amount,
                teams: [],
                timeSlots,
            });
        });

        if (result === IsRollback) {
            return null;
        }

        return result;
    }

    /**
     * This method works its way up the tree starting with the bracket. Will create
     * nested object list from bracket all the way to the contest.
     *
     * @param bracketId - Bracket id to search with
     * @returns - returns a Contest object with the tree to the bracket
     */
    async findPathByBracketId(bracketId: number): Promise<Contest | null> {
        logger.verbose("Entering method findPathByBracketId()", {
            class: this.className,
            values: bracketId,
        });

        const sqlSelect = `SELECT bracket.id as bracket_id, bracket.day_choices, bracket.max_team_amount, division.id as division_id, division.name as division_name, division.type, division.level, division.max_team_size, division.min_women_count, division.min_men_count, league.id as league_id, league.name as league_name, league.sport, league.start_date as league_start_date, league.end_date as league_end_date, contest.id as contest_id, contest.name as contest_name, contest.visibility, contest.status, contest.date_created, contest.start_date as contest_start_date, contest.end_date as contest_end_date, contest.playoff, contest.playoff_type, contest.playoff_seeding_type, contest.contest_type, contest.organization_id FROM bracket
        INNER JOIN division ON bracket.division_ID=division.id
        INNER JOIN league ON division.league_ID=league.id
        INNER JOIN contest ON league.contest_id=contest.id
        WHERE bracket.id = $1`;

        return withClient(async (querier) => {
            const [res] = (await querier(sqlSelect, [bracketId])).rows;

            if (res === undefined) {
                return null;
            }

            const bracket = new Bracket({
                id: res.bracket_id,
                dayChoices: res.day_choices,
                maxTeamAmount: res.max_team_amount,
                divisionId: res.division_id,
                teams: [],
                timeSlots: [],
            });

            const division = new Division({
                id: res.division_id,
                name: res.division_name,
                type: res.type,
                level: res.level,
                maxTeamSize: res.max_team_size,
                minWomenCount: res.min_women_count,
                minMenCount: res.min_men_count,
                brackets: [bracket],
                leagueId: res.league_id,
            });

            const league = new League({
                id: res.league_id,
                name: res.league_name,
                sport: res.sport,
                startDate: res.league_start_date,
                endDate: res.league_end_date,
                contestId: res.contest_id,
                divisions: [division],
                organizationId: res.organization_id,
            });

            const contest = new Contest({
                id: res.contest_id,
                name: res.contest_name,
                visibility: res.visibility,
                status: res.status,
                dateCreated: res.date_created,
                startDate: res.contest_start_date,
                endDate: res.contest_end_date,
                playoff: res.playoff,
                playoffType: res.playoff_type,
                playoffSeedingType: res.playoff_seeding_type,
                contestType: res.contest_type,
                leagues: [league],
                organizationId: res.organization_id,
            });

            return contest;
        });
    }

    // todo: async patchBracket(bracket: Bracket): Promise<Bracket[] | null>{    }
}

const test = new CompetitionDAO();
// const list: TournamentGame[] = [
//     new TournamentGame({
//         id: null,
//         dateCreated: null,
//         gameDate: null,
//         location: "GCU",
//         locationDetails: "",
//         scoreHome: 0,
//         scoreAway: 0,
//         seedHome: 1,
//         seedAway: 2,
//         statusHome: TournamentStatus.NOTPLAYED,
//         statusAway: TournamentStatus.NOTPLAYED,
//         level: 1,
//         round: 1,
//         homeTeamId: 4,
//         awayTeamId: 10,
//         tournamentId: 2,
//     }),
//     new TournamentGame({
//         id: null,
//         dateCreated: null,
//         gameDate: null,
//         location: "GCU",
//         locationDetails: "",
//         scoreHome: 0,
//         scoreAway: 0,
//         seedHome: 1,
//         seedAway: 2,
//         statusHome: TournamentStatus.NOTPLAYED,
//         statusAway: TournamentStatus.NOTPLAYED,
//         level: 1,
//         round: 2,
//         homeTeamId: 4,
//         awayTeamId: 10,
//         tournamentId: 2,
//     }),
// ];

testFunc();

async function testFunc() {
    // await test.findPathByBracketId(1);
    // await test.findLeaguesAndChildren(1);
    // console.log(await test.findTournamentByIdWithGames(2));
    // await test.createTournamentGames();
    // await test.createTournament(
    //     new Tournament({
    //         id: null,
    //         name: "My Tourney",
    //         visibility: Visibility.CLOSED,
    //         status: Status.ACTIVE,
    //         numberOfTeams: 2,
    //         dateCreated: null,
    //         startDate: new Date(),
    //         endDate: new Date(),
    //         tournamentType: TournamentType.RANDOM,
    //         sport: "soccer",
    //         games: [],
    //         organizationId: "03503875-f4a2-49f6-bb9f-e9a22fb852d4",
    //     })
    // );
    // await test.createTournamentGames(list);
}
