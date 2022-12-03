import { Player } from "./Player";

export class Team {
    protected id: number;
    protected name: string;
    protected wins: number|null;
    protected ties: number|null;
    protected losses: number|null;
    protected image: string|null;
    protected visibility: string;
    protected sport: string|null;
    protected dateCreated: Date|null;
    protected sportsmanshipScore: number
    protected status: string|null;
    protected maxTeamSize: number|null;
    protected womenCount: number;
    protected menCount: number;
    protected players: Player[]|null;
    protected organizationId: string;

    constructor(
        id: number,
        name: string,
        wins: number|null,
        ties: number|null,
        losses: number|null,
        image: string|null,
        visibility: string,
        sport: string|null,
        dateCreated: Date|null,
        sportsmanshipScore: number,
        status: string|null,
        maxTeamSize: number|null,
        womenCount: number,
        menCount: number,
        players: Player[]|null,
        organizationId: string
    ) {
        this.id = id
        this.name = name
        this.wins = wins
        this.ties = ties
        this.losses = losses
        this.image = image
        this.visibility = visibility
        this.sport = sport
        this.dateCreated = dateCreated
        this.womenCount = womenCount
        this.menCount = menCount
        this.name = name
        this.image = image
        this.visibility = visibility
        this.sportsmanshipScore = sportsmanshipScore
        this.status = status
        this.maxTeamSize = maxTeamSize
        this.players = players
        this.organizationId = organizationId
    }

    /** Constructor */
    // public static CreatedTeam(
    //     name: string,
    //     image: string,
    //     visibility: string,
    //     sport: string
    // ) {
    //     var result = new Team();

    //     result.name = name;
    //     result.image = image;
    //     result.visibility = visibility;
    //     // result.sport = sport;

    //     return result;
    // }

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

    public getWins(): number|null {
        return this.wins;
    }

    public setWins(wins: number|null): void {
        this.wins = wins;
    }

    public getTies(): number|null {
        return this.ties;
    }

    public setTies(ties: number|null): void {
        this.ties = ties;
    }

    public getLosses(): number|null {
        return this.losses;
    }

    public setLosses(losses: number|null): void {
        this.losses = losses;
    }

    public getImage(): string|null {
        return this.image;
    }

    public setImage(image: string|null): void {
        this.image = image;
    }

    public getVisibility(): string {
        return this.visibility;
    }

    public setVisibility(visibility: string): void {
        this.visibility = visibility;
    }

    public getSport(): string|null {
        return this.sport;
    }

    public setSport(sport: string|null): void {
        this.sport = sport;
    }

    public getDateCreated(): Date|null {
        return this.dateCreated;
    }

    public setDateCreated(dateCreated: Date|null): void {
        this.dateCreated = dateCreated;
    }

    public getWomenCount(): number {
        return this.womenCount;
    }

    public setWomenCount(womenCount: number): void {
        this.womenCount= womenCount;
    }

    public getMenCount(): number {
        return this.menCount;
    }

    public setMenCount(menCount: number): void {
        this.menCount = menCount;
    }

    public getSportsmanshipScore(): number {
        return this.sportsmanshipScore;
    }

    public setSportsmanshipScore(sportsmanshipScore: number): void {
        this.sportsmanshipScore = sportsmanshipScore;
    }

    public getStatus(): string|null {
        return this.status;
    }

    public setStatus(status: string|null): void {
        this.status = status;
    }

    public getMaxTeamSize(): number|null {
        return this.maxTeamSize;
    }

    public setMaxTeamSize(maxTeamSize: number|null): void {
        this.maxTeamSize = maxTeamSize;
    }

    public getPlayers(): Player[]|null {
        return this.players;
    }

    public setPlayers(players: Player[]|null): void {
        this.players = players;
    }

    public getOrganizationId(): string {
        return this.organizationId;
    }

    public setOrganizationId(organizationId: string): void {
        this.organizationId = organizationId;
    }
}
