import {
    CompetitionStatus,
    CompetitionVisibility,
    CompetitionSeason,
} from "../../utilities/enums/competitionEnum";
import { League } from "./League";

interface IContestProps {
    id: number;
    name: string | null;
    visibility: CompetitionVisibility | null;
    status: CompetitionStatus | null;
    season: CompetitionSeason | null;
    term: number | null;
    year: string | null;
    dateCreated: Date | null;
    leagues: League[];
    organizationId: string;
}

export class Contest {
    protected id: number;

    protected name: string | null;

    protected visibility: CompetitionVisibility | null;

    protected status: CompetitionStatus | null;

    protected season: CompetitionSeason | null;

    protected term: number | null;

    protected year: string | null;

    protected dateCreated: Date | null;

    protected leagues: League[];

    // protected organizationId: string;

    constructor(props: Partial<IContestProps>) {
        const {
            id = 0,
            name = "",
            visibility = null,
            status = null,
            season = null,
            term = null,
            year = null,
            dateCreated = null,
            leagues = [],
        } = props;

        this.id = id;
        this.name = name;
        this.visibility = visibility;
        this.status = status;
        this.season = season;
        this.term = term;
        this.year = year;
        this.dateCreated = dateCreated;
        this.leagues = leagues;
        // this.organizationId = organizationId;
    }

    public static fromDatabase(props: {
        id: number;
        name: string | null;
        visibility: CompetitionVisibility;
        status: CompetitionStatus;
        season: CompetitionSeason | null;
        term: number | null;
        year: string | null;
        date_created: Date;
        leagues: League[];
    }) {
        const obj = new Contest(props);
        obj.dateCreated = props.date_created;

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

    public getSeason(): CompetitionSeason | null {
        return this.season;
    }

    public setSeason(season: CompetitionSeason | null): void {
        this.season = season;
    }

    public getTerm(): number | null {
        return this.term;
    }

    public setTerm(term: number | null): void {
        this.term = term;
    }

    public getYear(): string | null {
        return this.year;
    }

    public setYear(year: string | null): void {
        this.year = year;
    }

    public getDateCreated(): Date | null {
        return this.dateCreated;
    }

    public setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
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
