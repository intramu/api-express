import { Visibility } from "../utilities/enums";
import { PlayerSmall } from "./PlayerSmall";

export class Team {
    protected id: number;

    protected name: string;

    protected wins: number | null;

    protected ties: number | null;

    protected losses: number | null;

    protected image: string | null;

    protected visibility: Visibility;

    protected sport: string | null;

    protected dateCreated: Date | null;

    protected sportsmanshipScore: number;

    protected status: string | null;

    protected maxTeamSize: number | null;

    protected players: PlayerSmall[];

    protected organizationId: string;

    protected bracketId: number | null;

    constructor(
        id: number,
        name: string,
        wins: number | null,
        ties: number | null,
        losses: number | null,
        image: string | null,
        visibility: Visibility,
        sport: string | null,
        dateCreated: Date | null,
        sportsmanshipScore: number,
        status: string | null,
        maxTeamSize: number | null,
        players: PlayerSmall[],
        organizationId: string,
        bracketId: number | null
    ) {
        this.id = id;
        this.name = name;
        this.wins = wins;
        this.ties = ties;
        this.losses = losses;
        this.image = image;
        this.sport = sport;
        this.dateCreated = dateCreated;
        this.name = name;
        this.image = image;
        this.visibility = visibility;
        this.sportsmanshipScore = sportsmanshipScore;
        this.status = status;
        this.maxTeamSize = maxTeamSize;
        this.players = players;
        this.organizationId = organizationId;
        this.bracketId = bracketId;
    }

    /** Constructor */
    // static CreatedTeam(
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

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getWins(): number | null {
        return this.wins;
    }

    setWins(wins: number | null): void {
        this.wins = wins;
    }

    getTies(): number | null {
        return this.ties;
    }

    setTies(ties: number | null): void {
        this.ties = ties;
    }

    getLosses(): number | null {
        return this.losses;
    }

    setLosses(losses: number | null): void {
        this.losses = losses;
    }

    getImage(): string | null {
        return this.image;
    }

    setImage(image: string | null): void {
        this.image = image;
    }

    getVisibility(): Visibility {
        return this.visibility;
    }

    setVisibility(visibility: Visibility): void {
        this.visibility = visibility;
    }

    getSport(): string | null {
        return this.sport;
    }

    setSport(sport: string | null): void {
        this.sport = sport;
    }

    getDateCreated(): Date | null {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date | null): void {
        this.dateCreated = dateCreated;
    }

    getSportsmanshipScore(): number {
        return this.sportsmanshipScore;
    }

    setSportsmanshipScore(sportsmanshipScore: number): void {
        this.sportsmanshipScore = sportsmanshipScore;
    }

    getStatus(): string | null {
        return this.status;
    }

    setStatus(status: string | null): void {
        this.status = status;
    }

    getMaxTeamSize(): number | null {
        return this.maxTeamSize;
    }

    setMaxTeamSize(maxTeamSize: number | null): void {
        this.maxTeamSize = maxTeamSize;
    }

    getPlayers(): PlayerSmall[] {
        return this.players;
    }

    setPlayers(players: PlayerSmall[]): void {
        this.players = players;
    }

    getOrganizationId(): string {
        return this.organizationId;
    }

    setOrganizationId(organizationId: string): void {
        this.organizationId = organizationId;
    }

    getBracketId(): number | null {
        return this.bracketId
    }

    setBracketId(bracketId: number | null): void{
        this.bracketId = bracketId
    }
}
