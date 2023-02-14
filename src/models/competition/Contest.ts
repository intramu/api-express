import {
    ContestType,
    PlayoffSeedingType,
    CompetitionStatus,
    TournamentType,
    CompetitionVisibility,
} from "../../utilities/enums/competitionEnum";
import { League } from "./League";

export class Contest {
    protected id;

    protected name;

    protected visibility;

    protected status;

    protected dateCreated;

    protected startDate;

    protected endDate;

    protected playoff;

    protected playoffType;

    protected playoffSeedingType;

    protected contestType;

    protected organizationId;

    constructor(props: {
        id: number;
        name: string | null;
        visibility: CompetitionVisibility | null;
        status: CompetitionStatus | null;
        dateCreated: Date | null;
        startDate: Date | null;
        endDate: Date | null;
        playoff: boolean;
        playoffType: TournamentType | null;
        playoffSeedingType: PlayoffSeedingType | null;
        contestType: ContestType | null;
        leagues: League[];
        organizationId: string;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.visibility = props.visibility;
        this.status = props.status;
        this.dateCreated = props.dateCreated;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.playoff = props.playoff;
        this.playoffType = props.playoffType;
        this.playoffSeedingType = props.playoffSeedingType;
        this.contestType = props.contestType;
        this.organizationId = props.organizationId;
    }

    public getId(): number {
        return this.id;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public getName(): string | null {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getVisibility(): CompetitionVisibility | null {
        return this.visibility;
    }

    public setVisibility(visibility: CompetitionVisibility): void {
        this.visibility = visibility;
    }

    public getStatus(): CompetitionStatus | null {
        return this.status;
    }

    public setStatus(status: CompetitionStatus): void {
        this.status = status;
    }

    public getDateCreated(): Date | null {
        return this.dateCreated;
    }

    public setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    public getStartDate(): Date | null {
        return this.startDate;
    }

    public setStartDate(startDate: Date | null): void {
        this.startDate = startDate;
    }

    public getEndDate(): Date | null {
        return this.endDate;
    }

    public setDate(endDate: Date | null): void {
        this.endDate = endDate;
    }

    public getPlayoff(): boolean {
        return this.playoff;
    }

    public setPlayoff(playoff: boolean): void {
        this.playoff = playoff;
    }

    public getPlayoffType(): TournamentType | null {
        return this.playoffType;
    }

    public setPlayoffType(playoffType: TournamentType | null): void {
        this.playoffType = playoffType;
    }

    public getPlayoffSeedingType(): PlayoffSeedingType | null {
        return this.playoffSeedingType;
    }

    public setPlayoffSeedingType(playoffSeedingType: PlayoffSeedingType | null): void {
        this.playoffSeedingType = playoffSeedingType;
    }

    public getContestType(): ContestType | null {
        return this.contestType;
    }

    public setContestType(contestType: ContestType | null): void {
        this.contestType = contestType;
    }

    public getOrganizationId(): string {
        return this.organizationId;
    }

    public setOrganizationId(organizationId: string): void {
        this.organizationId = organizationId;
    }
}
