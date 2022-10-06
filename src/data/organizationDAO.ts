import mysql2 from "mysql2/promise";
import { BracketModel } from "../models/Bracket";
import { DivisionModel } from "../models/Division";
import { LeagueModel } from "../models/League";
import { LeagueCompetitionModel } from "../models/LeagueCompetition";
import { TournamentCompetitionModel } from "../models/TournamentCompetition";
import logger from "../utilities/winstonConfig";

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default class organizationDAO {
    className = this.constructor.name;

    async createCompetition_league(competition: LeagueCompetitionModel, organizationId: string) {
        logger.verbose("Entering method createCompetition_league", {
            class: this.className,
        });

        let conn = null;
        const sqlComp =
            "INSERT INTO league_competition (NAME, VISIBILITY, STATUS, TYPE_OF_LEAGUE, organization_ID) VALUES(?,?,?,?,UNHEX(?))";

        const sqlLeague =
            "INSERT INTO league (NAME, SPORT, LEAGUE_START_DATE, LEAGUE_END_DATE, LEAGUE_DETAILS, LEAGUE_SETS_DATES, league_competition_ID) VALUES (?,?,?,?,?,?,?)";

        const sqlDivision =
            "INSERT INTO division (NAME, DIVISION_START_DATE, DIVISION_END_DATE, TYPE, LEVEL, league_ID, tournament_competition_ID) VALUES(?,?,?,?,?,?,?)";

        const sqlBracket =
            "INSERT INTO bracket (DAY_CHOICES, MAX_BRACKET_SIZE, division_ID) VALUES(?,?,?)";

        const sqlTimeslot =
            "INSERT INTO time_slots (START_TIME, END_TIME, bracket_ID) VALUES(?,?,?)";

        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();

            const [comp_r] = await conn.query(sqlComp, [
                competition.getName(),
                competition.getVisibility(),
                competition.getStatus(),
                competition.getType(),
                organizationId,
            ]);

            const compId: any = comp_r;

            for (let index = 0; index < competition.getLeagues().length; index++) {
                const league = competition.getLeagues()[index];
                const [league_r, fields2] = await conn.query(sqlLeague, [
                    league.getLeagueName(),
                    league.getLeagueSport(),
                    league.getLeagueStartDate(),
                    league.getLeagueEndDate(),
                    league.getLeagueDetails(),
                    league.getLeagueSetsDates(),
                    compId.insertId,
                ]);

                const leagueId: any = league_r;

                for (let index = 0; index < league.getDivisions().length; index++) {
                    const division = league.getDivisions()[index];
                    const [division_r] = await conn.query(sqlDivision, [
                        division.getDivisionName(),
                        division.getDivisionStartDate(),
                        division.getDivisionEndDate(),
                        division.getDivisionType(),
                        division.getDivisionLevel(),
                        leagueId.insertId,
                        null,
                    ]);

                    const divisionId: any = division_r;
                    for (let index = 0; index < division.getBrackets().length; index++) {
                        const bracket = division.getBrackets()[index];
                        const [bracket_r] = await conn.query(sqlBracket, [
                            bracket.getBracketDayChoices(),
                            bracket.getBracketMaxSize(),
                            divisionId.insertId,
                        ]);

                        const bracketId: any = bracket_r;
                        for (let index = 0; index < bracket.getBracketTimeSlots().length; index++) {
                            const timeSlot = bracket.getBracketTimeSlots()[index];

                            const timeslot: any = timeSlot;
                            await conn.query(sqlTimeslot, [
                                timeslot.startTime,
                                timeslot.endTime,
                                bracketId.insertId,
                            ]);
                        }
                    }
                }
            }
            await conn.commit();
        } catch (error) {
            console.log(error);

            if (conn) await conn.rollback();
            return null;
        } finally {
            if (conn) conn.release();
        }
    }

    async;

    /**
     * Creating a competition will create all the associated leagues, divisions,
     * brackets within one method. There will be separate methods to update,
     * delete, and create new leagues, divisions, and brackets after the intial
     * creation of the competition.
     */
}

const test = new organizationDAO();

const comp = {
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
                            bracketTimeSlots: [{ startTime: "2:00", endTime: "3:00" }],
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
const leagues = comp.leagues.map((league) => {
    const divisions = league.divisions.map((division) => {
        const brackets = division.brackets.map((bracket) => {
            return new BracketModel(
                bracket.bracketDayChoices,
                bracket.bracketTimeSlots,
                bracket.bracketMaxSize
            );
        });

        return new DivisionModel(
            division.divisionName,
            division.divisionType,
            division.divisionLevel,
            division.divisionStartDate,
            division.divisionEndDate,
            brackets
        );
    });

    return new LeagueModel(
        league.leagueName,
        league.leagueSport,
        league.leagueStartDate,
        league.leagueEndDate,
        league.leagueDetails,
        league.leagueSetsDates,
        divisions
    );
});

console.log(leagues);

const competition = new LeagueCompetitionModel(
    comp.competitionName,
    comp.competitionVisibility,
    comp.competitionStatus,
    comp.competitionType,
    new Date(),
    leagues
);

// console.log(competition.getLeagues()[0]);

test.createCompetition_league(competition, "c34430c203c9469c9052287f61a94866");
