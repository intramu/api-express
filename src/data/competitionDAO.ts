// import mysql2 from "mysql2/promise";
// import "dotenv/config";
// import logger from "../utilities/winstonConfig";
// import { LeagueCompetitionModel } from "../models/LeagueCompetition";
import format from "pg-format";
import { Tournament } from "../models/competition/Tournament";
import { TournamentGame } from "../models/competition/TournamentGame";
import { Status, TournamentStatus, TournamentType, Visibility } from "../utilities/enums";
import logger from "../utilities/winstonConfig";
import { withClient } from "./database";

export default class CompetitionDAO {
    private readonly className = this.constructor.name;

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

    async createTournamentGame(game: TournamentGame): Promise<TournamentGame | null> {
        logger.verbose("Entering method createTournamentGame()", {
            class: this.className,
            values: game,
        });

        const sqlAdd =
            "INSERT INTO tournament_game (GAME_DATE, LOCATION, LOCATION_DETAILS, SCORE_HOME, SCORE_AWAY, SEED_HOME, SEED_AWAY, STATUS_HOME, STATUS_AWAY, LEVEL, ROUND, HOME_TEAM_ID, AWAY_TEAM_ID, tournament_ID) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING tournament_ID";

        return withClient(async (querier) => {
            const response = await querier(sqlAdd, [
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

            const [results] = response.rows;
            if (results === undefined) {
                return null;
            }

            return new TournamentGame({
                id: results.id,
                dateCreated: results.date_created,
                gameDate: results.game_date,
                location: results.location,
                locationDetails: results.location_details,
                scoreHome: results.score_home,
                scoreAway: results.score_away,
                seedHome: results.seed_home,
                seedAway: results.seed_away,
                statusHome: results.status_home,
                statusAway: results.status_away,
                level: results.level,
                round: results.round,
                homeTeamId: results.home_team_id,
                awayTeamId: results.away_team_id,
                tournamentId: results.tournament_id,
            });
        });
    }

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
}

const test = new CompetitionDAO();
const list: TournamentGame[] = [
    new TournamentGame({
        id: null,
        dateCreated: null,
        gameDate: null,
        location: "GCU",
        locationDetails: "",
        scoreHome: 0,
        scoreAway: 0,
        seedHome: 1,
        seedAway: 2,
        statusHome: TournamentStatus.NOTPLAYED,
        statusAway: TournamentStatus.NOTPLAYED,
        level: 1,
        round: 1,
        homeTeamId: 4,
        awayTeamId: 10,
        tournamentId: 2,
    }),
    new TournamentGame({
        id: null,
        dateCreated: null,
        gameDate: null,
        location: "GCU",
        locationDetails: "",
        scoreHome: 0,
        scoreAway: 0,
        seedHome: 1,
        seedAway: 2,
        statusHome: TournamentStatus.NOTPLAYED,
        statusAway: TournamentStatus.NOTPLAYED,
        level: 1,
        round: 2,
        homeTeamId: 4,
        awayTeamId: 10,
        tournamentId: 2,
    }),
];

testFunc();

async function testFunc() {
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

// export default class CompetitionDAO {
//     className = this.constructor.name;
//     /**
//     async() {
//         logger.verbose("Entering method removeFromTeam()", {
//             class: this.className,
//         });
//         let conn = null;
//         let sql = "";

//         try {
//             conn = await pool.getConnection();

//             await conn.commit();
//             // return updateResult;
//         } catch (error) {
//             if (conn) await conn.rollback();
//             logger.crit("Database Connection / Query Error", {
//                 type: error,
//                 class: this.className,
//             });
//             return null;
//         } finally {
//             if (conn) conn.release();
//         }
//     }

//     */

//     async showCompetition_league() {
//         logger.verbose("Entering method removeFromTeam()", {
//             class: this.className,
//         });
//         let conn = null;
//         const sql = "";

//         try {
//             conn = await pool.getConnection();

//             await conn.commit();
//             // return updateResult;
//         } catch (error) {
//             if (conn) await conn.rollback();
//             logger.crit("Database Connection / Query Error", {
//                 type: error,
//                 class: this.className,
//             });
//             return null;
//         } finally {
//             if (conn) conn.release();
//         }
//     }

//     async createCompetition_league(competition: LeagueCompetitionModel, organizationId: string) {
//         logger.verbose("Entering method createCompetition_league", {
//             class: this.className,
//         });

//         let conn = null;
//         const sqlComp =
//             "INSERT INTO league_competition (NAME, VISIBILITY, STATUS, TYPE_OF_LEAGUE, organization_ID) VALUES(?,?,?,?,UNHEX(?))";

//         const sqlLeague =
//             "INSERT INTO league (NAME, SPORT, LEAGUE_START_DATE, LEAGUE_END_DATE, LEAGUE_DETAILS, LEAGUE_SETS_DATES, league_competition_ID) VALUES (?,?,?,?,?,?,?)";

//         const sqlDivision =
//             "INSERT INTO division (NAME, DIVISION_START_DATE, DIVISION_END_DATE, TYPE, LEVEL, league_ID, tournament_competition_ID) VALUES(?,?,?,?,?,?,?)";

//         const sqlBracket =
//             "INSERT INTO bracket (DAY_CHOICES, MAX_BRACKET_SIZE, division_ID) VALUES(?,?,?)";

//         const sqlTimeslot =
//             "INSERT INTO time_slots (START_TIME, END_TIME, bracket_ID) VALUES(?,?,?)";

//         try {
//             conn = await pool.getConnection();
//             await conn.beginTransaction();

//             const [comp_r] = await conn.query(sqlComp, [
//                 competition.getName(),
//                 competition.getVisibility(),
//                 competition.getStatus(),
//                 competition.getType(),
//                 organizationId,
//             ]);

//             const compId: any = comp_r;

//             for (let index = 0; index < competition.getLeagues().length; index++) {
//                 const league = competition.getLeagues()[index];
//                 const [league_r, fields2] = await conn.query(sqlLeague, [
//                     league.getLeagueName(),
//                     league.getLeagueSport(),
//                     league.getLeagueStartDate(),
//                     league.getLeagueEndDate(),
//                     league.getLeagueDetails(),
//                     league.getLeagueSetsDates(),
//                     compId.insertId,
//                 ]);

//                 const leagueId: any = league_r;

//                 for (let index = 0; index < league.getDivisions().length; index++) {
//                     const division = league.getDivisions()[index];
//                     const [division_r] = await conn.query(sqlDivision, [
//                         division.getDivisionName(),
//                         division.getDivisionStartDate(),
//                         division.getDivisionEndDate(),
//                         division.getDivisionType(),
//                         division.getDivisionLevel(),
//                         leagueId.insertId,
//                         null,
//                     ]);

//                     const divisionId: any = division_r;
//                     for (let index = 0; index < division.getBrackets().length; index++) {
//                         const bracket = division.getBrackets()[index];
//                         const [bracket_r] = await conn.query(sqlBracket, [
//                             bracket.getBracketDayChoices(),
//                             bracket.getBracketMaxSize(),
//                             divisionId.insertId,
//                         ]);

//                         const bracketId: any = bracket_r;
//                         for (let index = 0; index < bracket.getBracketTimeSlots().length; index++) {
//                             const timeSlot = bracket.getBracketTimeSlots()[index];

//                             const timeslot: any = timeSlot;
//                             await conn.query(sqlTimeslot, [
//                                 timeslot.startTime,
//                                 timeslot.endTime,
//                                 bracketId.insertId,
//                             ]);
//                         }
//                     }
//                 }
//             }
//             await conn.commit();
//         } catch (error) {
//             console.log(error);

//             if (conn) await conn.rollback();
//             return null;
//         } finally {
//             if (conn) conn.release();
//         }
//     }
// }
