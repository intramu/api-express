import { Status, Visibility } from "../utilities/enums";
import { PlayerSmall } from "./PlayerSmall";

export class Team {
    protected id;

    protected name;

    protected wins;

    protected ties;

    protected losses;

    protected image;

    protected visibility;

    protected sport;

    protected dateCreated;

    protected sportsmanshipScore;

    protected status;

    protected maxTeamSize;

    protected players;

    protected organizationId;

    protected bracketId;

    constructor(props: {
        id: number | null;
        name: string;
        wins: number | null;
        ties: number | null;
        losses: number | null;
        image: string;
        visibility: Visibility | null;
        sport: string;
        dateCreated: Date | null;
        sportsmanshipScore: number | null;
        status: Status | null;
        maxTeamSize: number | null;
        players: PlayerSmall[];
        organizationId: string;
        bracketId: number | null;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.wins = props.wins;
        this.ties = props.ties;
        this.losses = props.losses;
        this.image = props.image;
        this.sport = props.sport;
        this.dateCreated = props.dateCreated;
        this.image = props.image;
        this.visibility = props.visibility;
        this.sportsmanshipScore = props.sportsmanshipScore;
        this.status = props.status;
        this.maxTeamSize = props.maxTeamSize;
        this.players = props.players;
        this.organizationId = props.organizationId;
        this.bracketId = props.bracketId;
    }

    /** Constructor */
    // static CreatedTeam(
    //     name: string;
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

    getId(): number | null {
        return this.id;
    }

    setId(id: number | null): void {
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

    getImage(): string {
        return this.image;
    }

    setImage(image: string): void {
        this.image = image;
    }

    getVisibility(): Visibility | null {
        return this.visibility;
    }

    setVisibility(visibility: Visibility | null): void {
        this.visibility = visibility;
    }

    getSport(): string {
        return this.sport;
    }

    setSport(sport: string): void {
        this.sport = sport;
    }

    getDateCreated(): Date | null {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date | null): void {
        this.dateCreated = dateCreated;
    }

    getSportsmanshipScore(): number | null {
        return this.sportsmanshipScore;
    }

    setSportsmanshipScore(sportsmanshipScore: number | null): void {
        this.sportsmanshipScore = sportsmanshipScore;
    }

    getStatus(): Status | null {
        return this.status;
    }

    setStatus(status: Status | null): void {
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
        return this.bracketId;
    }

    setBracketId(bracketId: number | null): void {
        this.bracketId = bracketId;
    }
}
