import { BracketModel } from "./Bracket";

export class DivisionModel {
    protected divisionName: string;
    protected divisionType: string;
    protected divisionLevel: string;
    protected divisionStartDate: Date;
    protected divisionEndDate: Date;
    protected maxTeamSize: number;
    protected minWCount: number;
    protected minMCount: number;
    protected brackets: BracketModel[];

    constructor(
        divisionName: string,
        divisionType: string,
        divisionLevel: string,
        divisionStartDate: Date,
        divisionEndDate: Date,
        maxTeamSize: number,
        minWCount: number,
        minMCount: number,
        brackets: BracketModel[]
    ) {
        this.divisionName = divisionName;
        this.divisionType = divisionType;
        this.divisionLevel = divisionLevel;
        this.divisionStartDate = divisionStartDate;
        this.divisionEndDate = divisionEndDate;
        this.maxTeamSize = maxTeamSize;
        this.minWCount = minWCount;
        this.minMCount = minMCount;
        this.brackets = brackets;
    }

    public getDivisionName(): string {
        return this.divisionName;
    }

    public setDivisionName(divisionName: string): void {
        this.divisionName = divisionName;
    }

    public getDivisionType(): string {
        return this.divisionType;
    }

    public setDivisionType(divisionType: string): void {
        this.divisionType = divisionType;
    }

    public getDivisionLevel(): string {
        return this.divisionLevel;
    }

    public setDivisionLevel(divisionLevel: string): void {
        this.divisionLevel = divisionLevel;
    }

    public getDivisionStartDate(): Date {
        return this.divisionStartDate;
    }

    public setDivisionStartDate(divisionStartDate: Date): void {
        this.divisionStartDate = divisionStartDate;
    }

    public getDivisionEndDate(): Date {
        return this.divisionEndDate;
    }

    public setDivisionEndDate(divisionEndDate: Date): void {
        this.divisionEndDate = divisionEndDate;
    }

    public getMaxTeamSize(): number {
        return this.maxTeamSize;
    }

    public setMaxTeamSize(maxTeamSize: number): void {
        this.maxTeamSize = maxTeamSize;
    }

    public getMinWCount(): number {
        return this.minWCount;
    }

    public setMinWCount(minWCount: number): void {
        this.minWCount = minWCount;
    }

    public getMinMCount(): number {
        return this.minMCount;
    }

    public setMinMCount(minMCount: number): void {
        this.minMCount = minMCount;
    }

    public getBrackets(): BracketModel[] {
        return this.brackets;
    }

    public setBrackets(brackets: BracketModel[]): void {
        this.brackets = brackets;
    }
}
