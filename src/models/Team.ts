import { ITeamProps } from "../interfaces/ITeam";
import { Sport } from "../utilities/enums/commonEnum";
import { TeamGender, TeamStatus, TeamVisibility } from "../utilities/enums/teamEnum";
import { PlayerSmall } from "./PlayerSmall";

export class Team {
    protected id: number | null;

    protected name: string;

    protected wins: number | null;

    protected ties: number | null;

    protected losses: number | null;

    protected image: string;

    protected visibility: TeamVisibility | null;

    // protected sport: Sport | null;

    protected gender: TeamGender | null;

    protected dateCreated: Date | null;

    protected sportsmanshipScore: number | null;

    protected status: TeamStatus | null;

    protected maxTeamSize: number;

    protected players: PlayerSmall[];

    // protected     organizationId: string;

    protected bracketId: number | null;

    /** Constructor */
    constructor(props: Partial<ITeamProps>) {
        const {
            id = 0,
            name = "",
            wins = 0,
            ties = 0,
            losses = 0,
            image = "",
            visibility = null,
            sport = null,
            gender = null,
            dateCreated = null,
            sportsmanshipScore = null,
            status = null,
            maxTeamSize = 0,
            players = [],
            bracketId = null,
        } = props;

        this.id = id;
        this.name = name;
        this.wins = wins;
        this.ties = ties;
        this.losses = losses;
        this.image = image;
        // this.sport = sport;
        this.gender = gender;
        this.dateCreated = dateCreated;
        this.image = image;
        this.visibility = visibility;
        this.sportsmanshipScore = sportsmanshipScore;
        this.status = status;
        this.maxTeamSize = maxTeamSize;
        this.players = players;
        // this.organizationId = organizationId;
        this.bracketId = bracketId;
    }

    /** Static Functions */
    public static fromDatabase(props: {
        id: number;
        name: string;
        wins: number;
        ties: number;
        losses: number;
        image: string;
        visibility: TeamVisibility;
        sport: Sport;
        gender: TeamGender;
        date_created: Date;
        sportsmanship_score: number;
        status: TeamStatus;
        max_team_size: number;
        players: PlayerSmall[];
        // organization_id: string;
        bracket_id: number;
    }) {
        const obj = new Team(props);
        obj.dateCreated = props.date_created;
        obj.sportsmanshipScore = props.sportsmanship_score;
        obj.maxTeamSize = props.max_team_size;
        obj.bracketId = props.bracket_id;

        return obj;
    }

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

    getVisibility(): TeamVisibility | null {
        return this.visibility;
    }

    setVisibility(visibility: TeamVisibility | null): void {
        this.visibility = visibility;
    }

    // getSport(): Sport | null {
    //     return this.sport;
    // }

    // setSport(sport: Sport | null): void {
    //     this.sport = sport;
    // }

    getGender(): TeamGender | null {
        return this.gender;
    }

    setGender(gender: TeamGender | null): void {
        this.gender = gender;
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

    getStatus(): TeamStatus | null {
        return this.status;
    }

    setStatus(status: TeamStatus | null): void {
        this.status = status;
    }

    getMaxTeamSize(): number {
        return this.maxTeamSize;
    }

    setMaxTeamSize(maxTeamSize: number): void {
        this.maxTeamSize = maxTeamSize;
    }

    getPlayers(): PlayerSmall[] {
        return this.players;
    }

    setPlayers(players: PlayerSmall[]): void {
        this.players = players;
    }

    // getOrganizationId(): string {
    //     return this.organizationId;
    // }

    // setOrganizationId(organizationId: string): void {
    //     this.organizationId = organizationId;
    // }

    getBracketId(): number | null {
        return this.bracketId;
    }

    setBracketId(bracketId: number | null): void {
        this.bracketId = bracketId;
    }
}
