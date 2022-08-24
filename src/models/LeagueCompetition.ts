import { LeagueModel } from "./League";

export class LeagueCompetitionModel {
    protected name: string;
    protected visibility: string;
    protected status: string;
    protected type: string;
    protected dateCreated: Date;
    protected leagues: LeagueModel[];

    constructor(
        name: string,
        visibility: string,
        status: string,
        type: string,
        dateCreated: Date,
        leagues: LeagueModel[]
    ) {
        this.name = name;
        this.visibility = visibility;
        this.status = status;
        this.type = type;
        this.dateCreated = dateCreated;
        this.leagues = leagues;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getVisibility(): string {
        return this.visibility;
    }

    public setVisibility(visibility: string): void {
        this.visibility = visibility;
    }

    public getStatus(): string {
        return this.status;
    }

    public setStatus(status: string): void {
        this.status = status;
    }

    public getType(): string {
        return this.type;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public getDateCreated(): Date {
        return this.dateCreated;
    }

    public setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    public getLeagues(): LeagueModel[] {
        return this.leagues;
    }

    public setLeagues(leagues: LeagueModel[]): void {
        this.leagues = leagues;
    }
}
