export class Competition {
    protected competitionType: string;
    protected leagues: object[];

    constructor(competitionType: string, leagues: object[]) {
        this.competitionType = competitionType;
        this.leagues = leagues;
    }

    public getCompetitionType(): string {
        return this.competitionType;
    }

    public setCompetitionType(competitionType: string): void {
        this.competitionType = competitionType;
    }

    public getLeagues(): object[] {
        return this.leagues;
    }

    public setLeagues(leagues: object[]): void {
        this.leagues = leagues;
    }
}
