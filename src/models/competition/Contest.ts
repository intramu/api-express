import {
    ContestType,
    PlayoffSeedingType,
    CompetitionStatus,
    TournamentType,
    CompetitionVisibility,
} from "../../utilities/enums/competitionEnum";
import { League } from "./League";

interface IContestProps {
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
}

export class Contest {
    protected id: number;

    protected name: string | null;

    protected visibility: CompetitionVisibility | null;

    protected status: CompetitionStatus | null;

    protected dateCreated: Date | null;

    protected startDate: Date | null;

    protected endDate: Date | null;

    protected playoff: boolean;

    protected playoffType: TournamentType | null;

    protected playoffSeedingType: PlayoffSeedingType | null;

    protected contestType: ContestType | null;

    protected leagues: League[];

    // protected organizationId: string;

    constructor(props: Partial<IContestProps>) {
        const {
            id = 0,
            name = "",
            visibility = null,
            status = null,
            dateCreated = null,
            startDate = null,
            endDate = null,
            playoff = false,
            playoffType = null,
            playoffSeedingType = null,
            contestType = null,
            leagues = [],
        } = props;

        this.id = id;
        this.name = name;
        this.visibility = visibility;
        this.status = status;
        this.dateCreated = dateCreated;
        this.startDate = startDate;
        this.endDate = endDate;
        this.playoff = playoff;
        this.playoffType = playoffType;
        this.playoffSeedingType = playoffSeedingType;
        this.contestType = contestType;
        this.leagues = leagues;
        // this.organizationId = organizationId;
    }

    public static fromDatabase(props: {
        id: number;
        name: string | null;
        visibility: CompetitionVisibility | null;
        status: CompetitionStatus | null;
        date_created: Date | null;
        start_date: Date | null;
        end_date: Date | null;
        playoff: boolean;
        playoff_type: TournamentType | null;
        playoff_seeding_type: PlayoffSeedingType | null;
        contest_type: ContestType | null;
        leagues: League[];
    }) {
        const obj = new Contest(props);
        obj.dateCreated = props.date_created;
        obj.startDate = props.start_date;
        obj.endDate = props.end_date;
        obj.playoffType = props.playoff_type;
        obj.playoffSeedingType = props.playoff_seeding_type;
        obj.contestType = props.contest_type;

        return obj;
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

    public getLeagues(): League[] {
        return this.leagues;
    }

    public setLeagues(leagues: League[]): void {
        this.leagues = leagues;
    }

    // public getOrganizationId(): string {
    //     return this.organizationId;
    // }

    // public setOrganizationId(organizationId: string): void {
    //     this.organizationId = organizationId;
    // }
}
