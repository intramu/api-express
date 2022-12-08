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

    getDivisionName(): string {
        return this.divisionName;
    }

    setDivisionName(divisionName: string): void {
        this.divisionName = divisionName;
    }

    getDivisionType(): string {
        return this.divisionType;
    }

    setDivisionType(divisionType: string): void {
        this.divisionType = divisionType;
    }

    getDivisionLevel(): string {
        return this.divisionLevel;
    }

    setDivisionLevel(divisionLevel: string): void {
        this.divisionLevel = divisionLevel;
    }

    getDivisionStartDate(): Date {
        return this.divisionStartDate;
    }

    setDivisionStartDate(divisionStartDate: Date): void {
        this.divisionStartDate = divisionStartDate;
    }

    getDivisionEndDate(): Date {
        return this.divisionEndDate;
    }

    setDivisionEndDate(divisionEndDate: Date): void {
        this.divisionEndDate = divisionEndDate;
    }

    getMaxTeamSize(): number {
        return this.maxTeamSize;
    }

    setMaxTeamSize(maxTeamSize: number): void {
        this.maxTeamSize = maxTeamSize;
    }

    getMinWCount(): number {
        return this.minWCount;
    }

    setMinWCount(minWCount: number): void {
        this.minWCount = minWCount;
    }

    getMinMCount(): number {
        return this.minMCount;
    }

    setMinMCount(minMCount: number): void {
        this.minMCount = minMCount;
    }

    getBrackets(): BracketModel[] {
        return this.brackets;
    }

    setBrackets(brackets: BracketModel[]): void {
        this.brackets = brackets;
    }
}
