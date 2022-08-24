"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const Bracket_1 = require("../models/Bracket");
const Division_1 = require("../models/Division");
const League_1 = require("../models/League");
const LeagueCompetition_1 = require("../models/LeagueCompetition");
const winstonConfig_1 = __importDefault(require("../utilities/winstonConfig"));
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
class organizationDAO {
    constructor() {
        this.className = this.constructor.name;
        /**
         * Creating a competition will create all the associated leagues, divisions,
         * brackets within one method. There will be separate methods to update,
         * delete, and create new leagues, divisions, and brackets after the intial
         * creation of the competition.
         */
    }
    createCompetition_league(competition, organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            winstonConfig_1.default.verbose("Entering method createCompetition_league", {
                class: this.className,
            });
            let conn = null;
            let sqlComp = "INSERT INTO league_competition (NAME, VISIBILITY, STATUS, TYPE_OF_LEAGUE, organization_ID) VALUES(?,?,?,?,UNHEX(?))";
            let sqlLeague = "INSERT INTO league (NAME, SPORT, LEAGUE_START_DATE, LEAGUE_END_DATE, LEAGUE_DETAILS, LEAGUE_SETS_DATES, league_competition_ID) VALUES (?,?,?,?,?,?,?)";
            let sqlDivision = "INSERT INTO division (NAME, DIVISION_START_DATE, DIVISION_END_DATE, TYPE, LEVEL, league_ID, tournament_competition_ID) VALUES(?,?,?,?,?,?,?)";
            let sqlBracket = "INSERT INTO bracket (DAY_CHOICES, MAX_BRACKET_SIZE, division_ID) VALUES(?,?,?)";
            let sqlTimeslot = "INSERT INTO time_slots (START_TIME, END_TIME, bracket_ID) VALUES(?,?,?)";
            try {
                conn = yield pool.getConnection();
                yield conn.beginTransaction();
                const [comp_r] = yield conn.query(sqlComp, [
                    competition.getName(),
                    competition.getVisibility(),
                    competition.getStatus(),
                    competition.getType(),
                    organizationId,
                ]);
                let compId = comp_r;
                for (let index = 0; index < competition.getLeagues().length; index++) {
                    const league = competition.getLeagues()[index];
                    const [league_r, fields2] = yield conn.query(sqlLeague, [
                        league.getLeagueName(),
                        league.getLeagueSport(),
                        league.getLeagueStartDate(),
                        league.getLeagueEndDate(),
                        league.getLeagueDetails(),
                        league.getLeagueSetsDates(),
                        compId.insertId,
                    ]);
                    let leagueId = league_r;
                    for (let index = 0; index < league.getDivisions().length; index++) {
                        const division = league.getDivisions()[index];
                        const [division_r] = yield conn.query(sqlDivision, [
                            division.getDivisionName(),
                            division.getDivisionStartDate(),
                            division.getDivisionEndDate(),
                            division.getDivisionType(),
                            division.getDivisionLevel(),
                            leagueId.insertId,
                            null,
                        ]);
                        let divisionId = division_r;
                        for (let index = 0; index < division.getBrackets().length; index++) {
                            const bracket = division.getBrackets()[index];
                            const [bracket_r] = yield conn.query(sqlBracket, [
                                bracket.getBracketDayChoices(),
                                bracket.getBracketMaxSize(),
                                divisionId.insertId,
                            ]);
                            let bracketId = bracket_r;
                            for (let index = 0; index < bracket.getBracketTimeSlots().length; index++) {
                                const timeSlot = bracket.getBracketTimeSlots()[index];
                                let timeslot = timeSlot;
                                yield conn.query(sqlTimeslot, [
                                    timeslot.startTime,
                                    timeslot.endTime,
                                    bracketId.insertId,
                                ]);
                            }
                        }
                    }
                }
                yield conn.commit();
            }
            catch (error) {
                console.log(error);
                if (conn)
                    yield conn.rollback();
                return null;
            }
            finally {
                if (conn)
                    conn.release();
            }
        });
    }
}
exports.default = organizationDAO;
let test = new organizationDAO();
let comp = {
    competitionName: "Main Intramural",
    competitionVisibility: "public",
    competitionStatus: "run",
    competitionType: "league",
    leagueTournamentType: "",
    leagues: [
        {
            leagueName: "",
            leagueSport: "Soccer",
            leagueStartDate: new Date(),
            leagueEndDate: new Date(),
            leagueDetails: "who knows what will go here",
            leagueLinks: "http;no",
            leagueSetsDates: false,
            divisions: [
                {
                    divisionName: "",
                    divisionType: "Mens",
                    divisionLevel: "A",
                    divisionStartDate: new Date(),
                    divisionEndDate: new Date(),
                    brackets: [
                        {
                            bracketDayChoices: ["Monday, Tuesday"],
                            bracketTimeSlots: [
                                { startTime: "2:00", endTime: "3:00" },
                            ],
                            bracketMaxSize: 8,
                        },
                    ],
                },
            ],
        },
    ],
};
// let leagues: LeagueModel[] = [];
// let brackets: BracketModel[] =[];
// let divisions: DivisionModel[]=[];
let leagues = comp.leagues.map((league) => {
    let divisions = league.divisions.map((division) => {
        let brackets = division.brackets.map((bracket) => {
            return new Bracket_1.BracketModel(bracket.bracketDayChoices, bracket.bracketTimeSlots, bracket.bracketMaxSize);
        });
        return new Division_1.DivisionModel(division.divisionName, division.divisionType, division.divisionLevel, division.divisionStartDate, division.divisionEndDate, brackets);
    });
    return new League_1.LeagueModel(league.leagueName, league.leagueSport, league.leagueStartDate, league.leagueEndDate, league.leagueDetails, league.leagueSetsDates, divisions);
});
console.log(leagues);
let competition = new LeagueCompetition_1.LeagueCompetitionModel(comp.competitionName, comp.competitionVisibility, comp.competitionStatus, comp.competitionType, new Date(), leagues);
// console.log(competition.getLeagues()[0]);
test.createCompetition_league(competition, "c34430c203c9469c9052287f61a94866");
