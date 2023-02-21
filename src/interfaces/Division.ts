import { DivisionType, DivisionLevel } from "../utilities/enums/competitionEnum";
import { BracketNewInterface } from "./Bracket";

export interface DivisionNewInterface {
    name: string;
    type: DivisionType;
    level: DivisionLevel;
    maxTeamSize: number;
    minWomenCount: number;
    minMenCount: number;
    brackets: BracketNewInterface[];
}

export interface IDivisionDatabase {
    id: number;
    name: string | null;
    type: DivisionType | null;
    level: DivisionLevel | null;
    max_team_size: number;
    min_women_count: number | null;
    min_men_count: number | null;
    league_id: number;
}
