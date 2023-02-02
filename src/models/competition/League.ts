import { Sport } from "../../utilities/enums";
import { Division } from "./Division";

export class League {
    protected id;

    protected name;

    protected sport;

    protected startDate;

    protected endDate;

    protected divisions;

    protected contestId;

    protected organizationId;

    constructor(props: {
        id: number;
        name: string | null;
        sport: Sport | null;
        startDate: Date | null;
        endDate: Date | null;
        divisions: Division[];
        contestId: number;
        organizationId: string;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.sport = props.sport;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.divisions = props.divisions;
        this.contestId = props.contestId;
        this.organizationId = props.organizationId;
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

    public getContestId(): number {
        return this.contestId;
    }

    public setContestId(contestId: number): void {
        this.contestId = contestId;
    }

    public getOrganizationId(): string {
        return this.organizationId;
    }

    public setOrganizationId(organizationId: string): void {
        this.organizationId = organizationId;
    }
}
