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

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getVisibility(): string {
        return this.visibility;
    }

    setVisibility(visibility: string): void {
        this.visibility = visibility;
    }

    getStatus(): string {
        return this.status;
    }

    setStatus(status: string): void {
        this.status = status;
    }

    getType(): string {
        return this.type;
    }

    setType(type: string): void {
        this.type = type;
    }

    getDateCreated(): Date {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    getLeagues(): LeagueModel[] {
        return this.leagues;
    }

    setLeagues(leagues: LeagueModel[]): void {
        this.leagues = leagues;
    }
}
