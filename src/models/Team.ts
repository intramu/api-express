export class Team {
    protected id!: number;

    protected name!: string;

    protected wins!: number;

    protected ties!: number;

    protected losses!: number;

    protected image!: string;

    protected visibility!: string;

    // protected sport!: string;
    protected dateCreated!: Date;

    protected dateLastUpdated!: Date;

    protected wCount!: number;

    protected mCount!: number;

    /** Constructor */
    public static CreatedTeam(name: string, image: string, visibility: string, sport: string) {
        const result = new Team();

        result.name = name;
        result.image = image;
        result.visibility = visibility;
        // result.sport = sport;

        return result;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getWins(): number {
        return this.wins;
    }

    public setWins(wins: number): void {
        this.wins = wins;
    }

    public getTies(): number {
        return this.ties;
    }

    public setTies(ties: number): void {
        this.ties = ties;
    }

    public getLosses(): number {
        return this.losses;
    }

    public setLosses(losses: number): void {
        this.losses = losses;
    }

    public getImage(): string {
        return this.image;
    }

    public setImage(image: string): void {
        this.image = image;
    }

    public getVisibility(): string {
        return this.visibility;
    }

    public setVisibility(visibility: string): void {
        this.visibility = visibility;
    }

    // public getSport(): string {
    //     return this.sport;
    // }

    // public setSport(sport: string): void {
    //     this.sport = sport;
    // }

    public getDateCreated(): Date {
        return this.dateCreated;
    }

    public setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    public getDateLastUpdated(): Date {
        return this.dateLastUpdated;
    }

    public setDateLastUpdated(dateLastUpdated: Date): void {
        this.dateLastUpdated = dateLastUpdated;
    }

    public getWCount(): number {
        return this.wCount;
    }

    public setWCount(wCount: number): void {
        this.wCount = wCount;
    }

    public getMCount(): number {
        return this.mCount;
    }

    public setMCount(mCount: number): void {
        this.mCount = mCount;
    }
}
