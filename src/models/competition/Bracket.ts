import { Team } from "../Team";
import { TimeSlot } from "./TimeSlot";

export class Bracket {
    protected id;

    protected dayChoices;

    protected timeSlots;

    protected maxTeamAmount;

    protected teams;

    protected divisionId;

    constructor(props: {
        id: number;
        dayChoices: string[];
        timeSlots: TimeSlot[];
        maxTeamAmount: number;
        teams: Team[];
        divisionId: number;
    }) {
        this.id = props.id;
        this.dayChoices = props.dayChoices;
        this.timeSlots = props.timeSlots;
        this.maxTeamAmount = props.maxTeamAmount;
        this.divisionId = props.divisionId;
        this.teams = props.teams;
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

    public getTimeSlots(): TimeSlot[] {
        return this.timeSlots;
    }

    public setTimeSlots(timeSlots: TimeSlot[]): void {
        this.timeSlots = timeSlots;
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

    public getDivisionId(): number {
        return this.divisionId;
    }

    public setDivisionId(divisionId: number): void {
        this.divisionId = divisionId;
    }
}
