import range from "postgres-range";
import { TimeRange } from "../../interfaces/Bracket";
import { Team } from "../Team";
import { TimeSlot } from "./TimeSlot";

interface IBracketProps {
    id: number;
    dayChoices: string[];
    timeChoices: TimeRange[];
    maxTeamAmount: number;
    teams: Team[];
    divisionId: number;
}

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

        const temp: TimeRange = { startTime: new Date(), endTime: new Date() };
        obj.timeChoices = [temp];
        obj.maxTeamAmount = props.max_team_amount;

        return obj;
    }

    private static convertToTimeRanges(timeRanges: string) {
        const stripped = timeRanges.substring(1, timeRanges.length - 1).match(/[^,]+,[^,]+/g);
        if (!stripped) {
            return [];
        }

        return null;
        // return stripped.map((time) => {
        //     const date = range.parse(time);
        //     if (date.upper === null || date.lower === null) {
        //         throw new Error("Dates formatted incorrectly");
        //     }
        //     return { startTime: date.lower, endTime: date.upper };
        // });
    }

    // private convertToDatabaseFormat(timeRanges: TimeRange[]): string {
    //     const convertedTimes = timeRanges.map((time) => )
    //     return
    // };

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
