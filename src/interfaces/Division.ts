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
