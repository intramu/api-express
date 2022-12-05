import { DivisionModel } from "./Division";

export class TournamentCompetitionModel {
    protected name: string;

    protected visibility: string;

    protected status: string;

    protected sport: string;

    protected type: string;

    protected dateCreated: Date;

    protected divisions: DivisionModel[];

    constructor(
        name: string,
        visibility: string,
        status: string,
        sport: string,
        type: string,
        dateCreated: Date,
        divisions: DivisionModel[]
    ) {
        this.name = name;
        this.visibility = visibility;
        this.status = status;
        this.sport = sport;
        this.type = type;
        this.dateCreated = dateCreated;
        this.divisions = divisions;
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

    public getSport(): string {
        return this.sport;
    }

    public setSport(sport: string): void {
        this.sport = sport;
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

    public getDivisions(): DivisionModel[] {
        return this.divisions;
    }

    public setDivisions(divisions: DivisionModel[]): void {
        this.divisions = divisions;
    }
}
