import { Sport } from "../../utilities/enums/commonEnum";
import { Division } from "./Division";

interface ILeagueProps {
    id: number;
    name: string | null;
    sport: Sport | null;
    divisions: Division[];
    // contestId: number;
}

/**
 * League model that acts as a sport container for divisions
 * Child of Contest model
 */
export class League {
    protected id: number;

    protected name: string | null;

    protected sport: Sport | null;

    protected divisions: Division[];

    // protected contestId: number;

    constructor(props: Partial<ILeagueProps>) {
        const { id = 0, name = null, sport = null, divisions = [] } = props;

        this.id = id;
        this.name = name;
        this.sport = sport;
        this.divisions = divisions;
        // this.contestId = contestId;
    }

    public static fromDatabase(props: {
        id: number;
        name: string | null;
        sport: Sport | null;
        divisions: Division[];
    }) {
        const obj = new League(props);
        return obj;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getName(): string | null {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getSport(): Sport | null {
        return this.sport;
    }

    public setSport(sport: Sport | null): void {
        this.sport = sport;
    }

    public getDivisions(): Division[] {
        return this.divisions;
    }

    public setDivisions(divisions: Division[]): void {
        this.divisions = divisions;
    }

    // public getContestId(): number {
    //     return this.contestId;
    // }

    // public setContestId(contestId: number): void {
    //     this.contestId = contestId;
    // }
}
