import {
    DivisionType,
    DivisionLevel,
    DivisionStatus,
    ContestType,
    PlayoffType,
    PlayoffSeedingType,
} from "../utilities/enums/competitionEnum";
import { BracketNewInterface } from "./IBracket";

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
    league_id: number;
}
