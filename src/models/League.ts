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

    getLeagueName(): string {
        return this.leagueName;
    }

    setLeagueName(leagueName: string): void {
        this.leagueName = leagueName;
    }

    getLeagueSport(): string {
        return this.leagueSport;
    }

    setLeagueSport(leagueSport: string): void {
        this.leagueSport = leagueSport;
    }

    getLeagueStartDate(): Date {
        return this.leagueStartDate;
    }

    setLeagueStartDate(leagueStartDate: Date): void {
        this.leagueStartDate = leagueStartDate;
    }

    getLeagueEndDate(): Date {
        return this.leagueEndDate;
    }

    setLeagueEndDate(leagueEndDate: Date): void {
        this.leagueEndDate = leagueEndDate;
    }

    getLeagueDetails(): string {
        return this.leagueDetails;
    }

    setLeagueDetails(leagueDetails: string): void {
        this.leagueDetails = leagueDetails;
    }

    getLeagueSetsDates(): boolean {
        return this.leagueSetsDates;
    }

    setLeagueSetsDates(leagueSetsDates: boolean): void {
        this.leagueSetsDates = leagueSetsDates;
    }

    getDivisions(): DivisionModel[] {
        return this.divisions;
    }

    setDivisions(divisions: DivisionModel[]): void {
        this.divisions = divisions;
    }
}
