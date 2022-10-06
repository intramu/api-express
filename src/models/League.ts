import { DivisionModel } from "./Division";

export class LeagueModel {
    protected leagueName: string;

    protected leagueSport: string;

    protected leagueStartDate: Date;

    protected leagueEndDate: Date;

    protected leagueDetails: string;

    protected leagueSetsDates: boolean;

    protected divisions: DivisionModel[];

    constructor(
        leagueName: string,
        leagueSport: string,
        leagueStartDate: Date,
        leagueEndDate: Date,
        leagueDetails: string,
        leagueSetsDates: boolean,
        divisions: DivisionModel[]
    ) {
        this.leagueName = leagueName;
        this.leagueSport = leagueSport;
        this.leagueStartDate = leagueStartDate;
        this.leagueEndDate = leagueEndDate;
        this.leagueDetails = leagueDetails;
        this.leagueSetsDates = leagueSetsDates;
        this.divisions = divisions;
    }

    public getLeagueName(): string {
        return this.leagueName;
    }

    public setLeagueName(leagueName: string): void {
        this.leagueName = leagueName;
    }

    public getLeagueSport(): string {
        return this.leagueSport;
    }

    public setLeagueSport(leagueSport: string): void {
        this.leagueSport = leagueSport;
    }

    public getLeagueStartDate(): Date {
        return this.leagueStartDate;
    }

    public setLeagueStartDate(leagueStartDate: Date): void {
        this.leagueStartDate = leagueStartDate;
    }

    public getLeagueEndDate(): Date {
        return this.leagueEndDate;
    }

    public setLeagueEndDate(leagueEndDate: Date): void {
        this.leagueEndDate = leagueEndDate;
    }

    public getLeagueDetails(): string {
        return this.leagueDetails;
    }

    public setLeagueDetails(leagueDetails: string): void {
        this.leagueDetails = leagueDetails;
    }

    public getLeagueSetsDates(): boolean {
        return this.leagueSetsDates;
    }

    public setLeagueSetsDates(leagueSetsDates: boolean): void {
        this.leagueSetsDates = leagueSetsDates;
    }

    public getDivisions(): DivisionModel[] {
        return this.divisions;
    }

    public setDivisions(divisions: DivisionModel[]): void {
        this.divisions = divisions;
    }
}
