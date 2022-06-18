export class Team {
    protected id!: number;
    protected name!: string;
    protected wins!: number;
    protected ties!: number;
    protected losses!: number;
    protected image!: string;
    protected visibility!: string;
    protected sport!: string;
    protected currentTeamSize!: number;
    protected maxTeamSize!: number;
    protected dateCreated!: Date;
    protected dateLastUpdated!: Date;

    /** Constructor */
    public static CreatedTeam(
        name: string,
        image: string,
        visibility: string,
        sport: string
    ) {
        var result = new Team();

        result.name = name;
        result.image = image;
        result.visibility = visibility;
        result.sport = sport;

        return result;
    }

    /** Getters and Setters */
    public get $id(): number {
        return this.id;
    }
    public set $id(value: number) {
        this.id = value;
    }
    public get $name(): string {
        return this.name;
    }
    public set $name(value: string) {
        this.name = value;
    }
    public get $wins(): number {
        return this.wins;
    }
    public set $wins(value: number) {
        this.wins = value;
    }
    public get $ties(): number {
        return this.ties;
    }
    public set $ties(value: number) {
        this.ties = value;
    }
    public get $losses(): number {
        return this.losses;
    }
    public set $losses(value: number) {
        this.losses = value;
    }
    public get $image(): string {
        return this.image;
    }
    public set $image(value: string) {
        this.image = value;
    }
    public get $visibility(): string {
        return this.visibility;
    }
    public set $visibility(value: string) {
        this.visibility = value;
    }
    public get $sport(): string {
        return this.sport;
    }
    public set $sport(value: string) {
        this.sport = value;
    }
    public get $currentTeamSize(): number {
        return this.currentTeamSize;
    }
    public set $currentTeamSize(value: number) {
        this.currentTeamSize = value;
    }
    public get $maxTeamSize(): number {
        return this.maxTeamSize;
    }
    public set $maxTeamSize(value: number) {
        this.maxTeamSize = value;
    }
    public get $dateCreated(): Date {
        return this.dateCreated;
    }
    public set $dateCreated(value: Date) {
        this.dateCreated = value;
    }
    public get $dateLastUpdated(): Date {
        return this.dateLastUpdated;
    }
    public set $dateLastUpdated(value: Date) {
        this.dateLastUpdated = value;
    }
    // public get $captainId(): string {
    //     return this.captainId;
    // }
    // public set $captainId(value: string) {
    //     this.captainId = value;
    // }
}
