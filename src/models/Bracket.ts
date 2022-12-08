/* eslint-disable @typescript-eslint/ban-types */
export class BracketModel {
    protected bracketDayChoices: string[];

    protected bracketTimeSlots: Object[];

    protected bracketMaxSize: number;

    constructor(bracketDayChoices: string[], bracketTimeSlots: Object[], bracketMaxSize: number) {
        this.bracketDayChoices = bracketDayChoices;
        this.bracketTimeSlots = bracketTimeSlots;
        this.bracketMaxSize = bracketMaxSize;
    }

    getBracketDayChoices(): string[] {
        return this.bracketDayChoices;
    }

    setBracketDayChoices(bracketDayChoices: string[]): void {
        this.bracketDayChoices = bracketDayChoices;
    }

    getBracketTimeSlots(): Object[] {
        return this.bracketTimeSlots;
    }

    setBracketTimeSlots(bracketTimeSlots: Object[]): void {
        this.bracketTimeSlots = bracketTimeSlots;
    }

    getBracketMaxSize(): number {
        return this.bracketMaxSize;
    }

    setBracketMaxSize(bracketMaxSize: number): void {
        this.bracketMaxSize = bracketMaxSize;
    }
}
