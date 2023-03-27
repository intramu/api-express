import { Sport } from "../utilities/enums/commonEnum";
import { DivisionNewInterface } from "./IDivision";

export interface ILeagueNew {
    name: string;
    sport: Sport;
    divisions: DivisionNewInterface[];
}

export interface ILeagueDatabase {
    id: number;
    name: string;
    sport: Sport;
    contest_id: number;
    // organization_id: string;
}
