import {
    ContestType,
    DivisionLevel,
    DivisionStatus,
    DivisionType,
    PlayoffSeedingType,
    PlayoffType,
} from "../../utilities/enums/competitionEnum";
import { Bracket } from "./Bracket";

interface IDivisionProps {
    id: number;
    name: string | null;
    type: DivisionType | null;
    level: DivisionLevel | null;
    status: DivisionStatus | null;
    maxTeamSize: number;
    minWomenCount: number | null;
    minMenCount: number | null;
    startDate: Date | null;
    endDate: Date | null;
    registrationStartDate: Date | null;
    registrationEndDate: Date | null;
    contestType: ContestType | null;
    playoff: boolean;
    playoffType: PlayoffType | null;
    playoffSeedingType: PlayoffSeedingType | null;
    brackets: Bracket[];
    // leagueId: number;
}

export class Division {
    protected id: number;

    protected name: string | null;

    protected type: DivisionType | null;

    protected level: DivisionLevel | null;

    protected status: DivisionStatus | null;

    protected maxTeamSize: number;

    protected minWomenCount: number | null;

    protected minMenCount: number | null;

    protected startDate: Date | null;

    protected endDate: Date | null;

    protected registrationStartDate: Date | null;

    protected registrationEndDate: Date | null;

    protected contestType: ContestType | null;

    protected playoffType: PlayoffType | null;

    protected playoffSeedingType: PlayoffSeedingType | null;

    protected brackets: Bracket[];

    // protected leagueId: number;

    constructor(props: Partial<IDivisionProps>) {
        const {
            id = 0,
            name = null,
            type = null,
            level = null,
            status = null,
            maxTeamSize = 0,
            minWomenCount = null,
            minMenCount = null,
            startDate = null,
            endDate = null,
            registrationStartDate = null,
            registrationEndDate = null,
            contestType = null,
            playoffType = null,
            playoffSeedingType = null,
            brackets = [],
        } = props;

        this.id = id;
        this.name = name;
        this.type = type;
        this.level = level;
        this.status = status;
        this.maxTeamSize = maxTeamSize;
        this.minMenCount = minMenCount;
        this.minWomenCount = minWomenCount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.registrationStartDate = registrationStartDate;
        this.registrationEndDate = registrationEndDate;
        this.contestType = contestType;
        this.playoffType = playoffType;
        this.playoffSeedingType = playoffSeedingType;
        this.brackets = brackets;
    }

    public static fromDatabase(props: {
        id: number;
        name: string | null;
        type: DivisionType;
        level: DivisionLevel;
        status: DivisionStatus;
        max_team_size: number;
        min_women_count: number;
        min_men_count: number;
        start_date: Date;
        end_date: Date;
        registration_start_date: Date;
        registration_end_date: Date;
        contest_type: ContestType;
        playoff_type: PlayoffType;
        playoff_seeding_type: PlayoffSeedingType;
        brackets: Bracket[];
    }) {
        const obj = new Division(props);
        obj.maxTeamSize = props.max_team_size;
        obj.minWomenCount = props.min_women_count;
        obj.minMenCount = props.min_men_count;
        obj.startDate = props.start_date;
        obj.endDate = props.end_date;
        obj.registrationStartDate = props.registration_start_date;
        obj.registrationEndDate = props.registration_end_date;
        obj.contestType = props.contest_type;
        obj.playoffType = props.playoff_type;
        obj.playoffSeedingType = props.playoff_seeding_type;

        return obj;
    }

    public getName(): string | null {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getType(): DivisionType | null {
        return this.type;
    }

    public setType(type: DivisionType | null): void {
        this.type = type;
    }

    public getLevel(): DivisionLevel | null {
        return this.level;
    }

    public setLevel(level: DivisionLevel | null): void {
        this.level = level;
    }

    public getStatus(): DivisionStatus | null {
        return this.status;
    }

    public setStatus(status: DivisionStatus | null): void {
        this.status = status;
    }

    public getMaxTeamSize(): number {
        return this.maxTeamSize;
    }

    public setMaxTeamSize(maxTeamSize: number): void {
        this.maxTeamSize = maxTeamSize;
    }

    public getMinWomenCount(): number | null {
        return this.minWomenCount;
    }

    public setMinWomenCount(minWomenCount: number | null): void {
        this.minWomenCount = minWomenCount;
    }

    public getMinMenCount(): number | null {
        return this.minMenCount;
    }

    public setMinMenCount(minMenCount: number | null): void {
        this.minMenCount = minMenCount;
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

    public setEndDate(endDate: Date | null): void {
        this.endDate = endDate;
    }

    public getRegistrationStartDate(): Date | null {
        return this.registrationStartDate;
    }

    public setRegistrationStartDate(registrationStartDate: Date | null): void {
        this.registrationStartDate = registrationStartDate;
    }

    public getRegistrationEndDate(): Date | null {
        return this.registrationEndDate;
    }

    public setRegistrationEndDate(registrationEndDate: Date | null): void {
        this.registrationEndDate = registrationEndDate;
    }

    // public getPlayoff(): boolean {
    //     return this.playoff;
    // }

    // public setPlayoff(playoff: boolean): void {
    //     this.playoff = playoff;
    // }

    public getContestType(): ContestType | null {
        return this.contestType;
    }

    public setContestType(contestType: ContestType | null): void {
        this.contestType = contestType;
    }

    public getPlayoffType(): PlayoffType | null {
        return this.playoffType;
    }

    public setPlayoffType(playoffType: PlayoffType | null): void {
        this.playoffType = playoffType;
    }

    public getPlayoffSeedingType(): PlayoffSeedingType | null {
        return this.playoffSeedingType;
    }

    public setPlayoffSeedingType(playoffSeedingType: PlayoffSeedingType | null): void {
        this.playoffSeedingType = playoffSeedingType;
    }

    public getBrackets(): Bracket[] {
        return this.brackets;
    }

    public setBrackets(brackets: Bracket[]): void {
        this.brackets = brackets;
    }

    // public getLeagueId(): number {
    //     return this.leagueId;
    // }

    // public setLeagueId(leagueId: number): void {
    //     this.leagueId = leagueId;
    // }
}
