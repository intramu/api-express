import { Status, TournamentType, Visibility } from "../../utilities/enums";
import { TournamentGame } from "./TournamentGame";

export class Tournament {
    protected id;

    protected name;

    protected visibility;

    protected status;

    protected numberOfTeams;

    protected dateCreated;

    protected startDate;

    protected endDate;

    protected tournamentType;

    protected sport;

    protected games;

    protected organizationId;

    constructor(props: {
        id: number | null;
        name: string;
        visibility: Visibility | null;
        status: Status | null;
        numberOfTeams: number | null;
        dateCreated: Date | null;
        startDate: Date | null;
        endDate: Date | null;
        tournamentType: TournamentType | null;
        sport: string;
        games: TournamentGame[];
        organizationId: string;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.visibility = props.visibility;
        this.status = props.status;
        this.numberOfTeams = props.numberOfTeams;
        this.dateCreated = props.dateCreated;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.tournamentType = props.tournamentType;
        this.sport = props.sport;
        this.games = props.games;
        this.organizationId = props.organizationId;
    }

    getId(): number | null {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getVisibility(): Visibility | null {
        return this.visibility;
    }

    setVisibility(visibility: Visibility | null): void {
        this.visibility = visibility;
    }

    getStatus(): Status | null {
        return this.status;
    }

    setStatus(status: Status | null): void {
        this.status = status;
    }

    getNumberOfTeams(): number | null {
        return this.numberOfTeams;
    }

    setNumberOfTeams(numberOfTeams: number): void {
        this.numberOfTeams = numberOfTeams;
    }

    getDateCreated(): Date | null {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date | null): void {
        this.dateCreated = dateCreated;
    }

    getStartDate(): Date | null {
        return this.startDate;
    }

    setStartDate(startDate: Date | null): void {
        this.startDate = startDate;
    }

    getEndDate(): Date | null {
        return this.endDate;
    }

    setEndDate(endDate: Date | null): void {
        this.endDate = endDate;
    }

    getTournamentType(): TournamentType | null {
        return this.tournamentType;
    }

    setTournamentType(tournamentType: TournamentType | null): void {
        this.tournamentType = tournamentType;
    }

    getSport(): string {
        return this.sport;
    }

    setSport(sport: string): void {
        this.sport = sport;
    }

    getGames(): TournamentGame[] {
        return this.games;
    }

    setGames(games: TournamentGame[]) {
        this.games = games;
    }

    getOrganizationId(): string {
        return this.organizationId;
    }

    setOrganizationId(organizationId: string): void {
        this.organizationId = organizationId;
    }
}
