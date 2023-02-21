import { Sport } from "../../utilities/enums/commonEnum";
import { Division } from "./Division";

interface ILeagueProps {
    id: number;
    name: string | null;
    sport: Sport | null;
    startDate: Date | null;
    endDate: Date | null;
    divisions: Division[];
    // contestId: number;
    // organizationId: string;
}

export class League {
    protected id: number;

    protected name: string | null;

    protected sport: Sport | null;

    protected startDate: Date | null;

    protected endDate: Date | null;

    protected divisions: Division[];

    // protected contestId: number;

    // protected organizationId: string;

    constructor(props: Partial<ILeagueProps>) {
        const {
            id = 0,
            name = null,
            sport = null,
            startDate = null,
            endDate = null,
            divisions = [],
        } = props;

        this.id = id;
        this.name = name;
        this.sport = sport;
        this.startDate = startDate;
        this.endDate = endDate;
        this.divisions = divisions;
        // this.contestId = contestId;
        // this.organizationId = organizationId;
    }

    public static fromDatabase(props: {
        id: number;
        name: string | null;
        sport: Sport | null;
        start_date: Date | null;
        end_date: Date | null;
        divisions: Division[];
    }) {
        const obj = new League(props);
        obj.startDate = props.start_date;
        obj.endDate = props.end_date;

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

    public getStartDate(): Date | null {
        return this.startDate;
    }

    public setStartDate(startDate: Date): void {
        this.startDate = startDate;
    }

    public getEndDate(): Date | null {
        return this.endDate;
    }

    public setEndDate(endDate: Date): void {
        this.endDate = endDate;
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

    // public getOrganizationId(): string {
    //     return this.organizationId;
    // }

    // public setOrganizationId(organizationId: string): void {
    //     this.organizationId = organizationId;
    // }
}
