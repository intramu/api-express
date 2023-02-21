import { DivisionLevel, DivisionType } from "../../utilities/enums/competitionEnum";
import { Bracket } from "./Bracket";

interface IDivisionProps {
    id: number;
    name: string | null;
    type: DivisionType | null;
    level: DivisionLevel | null;
    maxTeamSize: number;
    minWomenCount: number | null;
    minMenCount: number | null;
    brackets: Bracket[];
    leagueId: number;
}
export class Division {
    protected id: number;

    protected name: string | null;

    protected type: DivisionType | null;

    protected level: DivisionLevel | null;

    protected maxTeamSize: number;

    protected minWomenCount: number | null;

    protected minMenCount: number | null;

    protected brackets: Bracket[];

    // protected leagueId: number;

    constructor(props: Partial<IDivisionProps>) {
        const {
            id = 0,
            name = null,
            type = null,
            level = null,
            maxTeamSize = 0,
            minWomenCount = null,
            minMenCount = null,
            brackets = [],
        } = props;

        this.id = id;
        this.name = name;
        this.type = type;
        this.level = level;
        this.maxTeamSize = maxTeamSize;
        this.minMenCount = minMenCount;
        this.minWomenCount = minWomenCount;
        this.brackets = brackets;
    }

    public static fromDatabase(props: {
        id: number;
        name: string | null;
        type: DivisionType | null;
        level: DivisionLevel | null;
        max_team_size: number;
        min_women_count: number | null;
        min_men_count: number | null;
        brackets: Bracket[];
    }) {
        const obj = new Division(props);
        obj.maxTeamSize = props.max_team_size;
        obj.minWomenCount = props.min_women_count;
        obj.minMenCount = props.min_men_count;

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
