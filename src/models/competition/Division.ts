import { DivisionLevel, DivisionType } from "../../utilities/enums/competitionEnum";
import { Bracket } from "./Bracket";

export class Division {
    protected id;

    protected name;

    protected type;

    protected level;

    protected maxTeamSize;

    protected minWomenCount;

    protected minMenCount;

    protected brackets;

    protected leagueId;

    constructor(props: {
        id: number;
        name: string | null;
        type: DivisionType | null;
        level: DivisionLevel | null;
        maxTeamSize: number;
        minWomenCount: number | null;
        minMenCount: number | null;
        brackets: Bracket[];
        leagueId: number;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.type = props.type;
        this.level = props.level;
        this.maxTeamSize = props.maxTeamSize;
        this.minWomenCount = props.minWomenCount;
        this.minMenCount = props.minMenCount;
        this.brackets = props.brackets;
        this.leagueId = props.leagueId;
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

    public getLeagueId(): number {
        return this.leagueId;
    }

    public setLeagueId(leagueId: number): void {
        this.leagueId = leagueId;
    }
}
