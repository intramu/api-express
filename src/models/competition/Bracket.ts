import range from "postgres-range";
import { IBracketDatabase, TimeRange } from "../../interfaces/IBracket";
import logger from "../../utilities/winstonConfig";
import { Team } from "../Team";
import { TimeSlot } from "./TimeSlot";

interface IBracketProps {
    id: number;
    dayChoices: string[];
    timeChoices: TimeRange[];
    maxTeamAmount: number;
    teams: Team[];
    // divisionId: number;
}

// this probably will not work in production. It is a little to strict on defining game times and day choices, but I'm going to leave it for now
export class Bracket {
    protected id;

    protected dayChoices;

    protected timeChoices;

    protected maxTeamAmount;

    protected teams;

    // protected divisionId;

    constructor(props: Partial<IBracketProps>) {
        const { id = 0, dayChoices = [], timeChoices = [], maxTeamAmount = 0, teams = [] } = props;

        this.id = id;
        this.dayChoices = dayChoices;
        this.timeChoices = timeChoices;
        this.maxTeamAmount = maxTeamAmount;
        // this.divisionId = divisionId;
        this.teams = teams;
    }

    public static fromDatabase(props: {
        id: number;
        day_choices: string[];
        time_choices: string;
        max_team_amount: number;
        teams: Team[];
        // divisionId: number;
    }) {
        const obj = new Bracket(props);
        obj.dayChoices = props.day_choices;
        obj.timeChoices = this.convertToTimeRanges(props.time_choices);
        obj.maxTeamAmount = props.max_team_amount;

        return obj;
    }

    // public static fromDatabaseMultiple(brackets: IBracketDatabase[]) {
    //     console.log("ssuueze", brackets);

    //     const ist = brackets.map((element) => {
    //         return Bracket.fromDatabase({ ...element, teams: [] });
    //     });

    //     console.log("ist", ist);

    //     return ist;
    // }

    private static convertToTimeRanges(timeRanges: string): TimeRange[] {
        if (!timeRanges) {
            return [];
        }

        const arrayReg = /[^,]+,[^,]+/g;

        console.log("first", timeRanges);

        const stripped = timeRanges.substring(1, timeRanges.length - 1).match(arrayReg);
        console.log("in", stripped);

        if (!stripped) {
            return [];
        }

        try {
            return stripped.map((time) => {
                const formattedTime = range.parse(time);
                if (!formattedTime.upper || !formattedTime.lower) {
                    logger.error("Time formatted incorrectly", { class: "Bracket" });
                    throw new Error("Time formatted incorrectly");
                }

                // const startTime = this.parseDate(formattedTime.lower);
                // const endTime = this.parseDate(formattedTime.upper);

                return { startTime: formattedTime.lower, endTime: formattedTime.upper };
            });
            // TODO: handle error
        } catch (error) {
            console.log(error);

            return [];
        }
    }

    private static parseDate(str: string): Date {
        const timeReg = /(\d+)[\.|:](\d+)[\.|:](\d+)/;

        const time = str.match(timeReg);
        if (!time) {
            logger.error("Date in incorrect format", { class: "Bracket" });
            throw new Error("Date in incorrect format");
        }

        const date = new Date();
        date.setHours(Number(time[1]));
        date.setMinutes(Number(time[2]));
        date.setSeconds(Number(time[3]));

        return date;
    }

    // convertTimeSlotsToDatabaseFormat(): string {
    //     return `{${this.timeChoices.map((range) => {
    //         console.log(range);
    //         `[${this.convertToTime(range.startTime)}, ${this.convertToTime(range.endTime)}]`;
    //     })}}`;
    // }

    convertTimeSlotsToDatabaseFormat(): string {
        const test = `{${this.timeChoices.map((range) => {
            console.log(range);
            return `[${range.startTime}, ${range.endTime}]`;
        })}}`;

        console.log("test", test);

        return test;
    }

    private convertToTime(date: Date): string {
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getDayChoices(): string[] {
        return this.dayChoices;
    }

    public setDayChoices(dayChoices: string[]): void {
        this.dayChoices = dayChoices;
    }

    public getTimeChoices(): TimeRange[] {
        return this.timeChoices;
    }

    public setTimeChoies(timeChoices: TimeRange[]): void {
        this.timeChoices = timeChoices;
    }

    public getMaxTeamAmount(): number {
        return this.maxTeamAmount;
    }

    public setMaxTeamAmount(maxTeamAmount: number): void {
        this.maxTeamAmount = maxTeamAmount;
    }

    getTeams(): Team[] {
        return this.teams;
    }

    setTeams(teams: Team[]): void {
        this.teams = teams;
    }

    // public getDivisionId(): number {
    //     return this.divisionId;
    // }

    // public setDivisionId(divisionId: number): void {
    //     this.divisionId = divisionId;
    // }
}
