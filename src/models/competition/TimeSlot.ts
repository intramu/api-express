export class TimeSlot {
    protected id;

    protected startTime;

    protected endTime;

    protected bracketId;

    constructor(props: { id: number; startTime: Date; endTime: Date; bracketId: number }) {
        this.id = props.id;
        this.startTime = props.startTime;
        this.endTime = props.endTime;
        this.bracketId = props.bracketId;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getStartTime(): Date {
        return this.startTime;
    }

    setStartTime(startTime: Date): void {
        this.startTime = startTime;
    }

    getEndTime(): Date {
        return this.endTime;
    }

    setEndTime(endTime: Date): void {
        this.endTime = endTime;
    }

    getBracketId(): number {
        return this.bracketId;
    }

    setBracketId(bracketId: number): void {
        this.bracketId = bracketId;
    }
}
