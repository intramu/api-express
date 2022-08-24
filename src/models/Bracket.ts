export class BracketModel {
    protected bracketDayChoices: string[];
    protected bracketTimeSlots: Object[];
    protected bracketMaxSize: number;

    constructor(
        bracketDayChoices: string[],
        bracketTimeSlots: Object[],
        bracketMaxSize: number
    ) {
        this.bracketDayChoices = bracketDayChoices;
        this.bracketTimeSlots = bracketTimeSlots;
        this.bracketMaxSize = bracketMaxSize;
    }

    public getBracketDayChoices(): string[] {
        return this.bracketDayChoices;
    }

    public setBracketDayChoices(bracketDayChoices: string[]): void {
        this.bracketDayChoices = bracketDayChoices;
    }

    public getBracketTimeSlots(): Object[] {
        return this.bracketTimeSlots;
    }

    public setBracketTimeSlots(bracketTimeSlots: Object[]): void {
        this.bracketTimeSlots = bracketTimeSlots;
    }

    public getBracketMaxSize(): number {
        return this.bracketMaxSize;
    }

    public setBracketMaxSize(bracketMaxSize: number): void {
        this.bracketMaxSize = bracketMaxSize;
    }
}
