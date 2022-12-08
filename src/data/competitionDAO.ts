// import mysql2 from "mysql2/promise";
// import "dotenv/config";
// import logger from "../utilities/winstonConfig";
// import { LeagueCompetitionModel } from "../models/LeagueCompetition";

// const pool = mysql2.createPool({
//     connectionLimit: 10,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

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
