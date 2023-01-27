import { DivisionModel } from "../Division";

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

    getSport(): string {
        return this.sport;
    }

    setSport(sport: string): void {
        this.sport = sport;
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

    getDivisions(): DivisionModel[] {
        return this.divisions;
    }

    setDivisions(divisions: DivisionModel[]): void {
        this.divisions = divisions;
    }
}
