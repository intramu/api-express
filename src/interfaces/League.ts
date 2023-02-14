import { Sport } from "../utilities/enums/commonEnum";
import { DivisionNewInterface } from "./Division";

export interface LeagueNewInterface {
    name: string;
    sport: Sport;
    startDate: Date;
    endDate: Date;
    divisions: DivisionNewInterface[];
}

export interface LeagueDatabaseInterface {
    id: number;
    name: string;
    sport: Sport;
    start_date: Date;
    end_date: Date;
    contest_id: number;
    organization_id: string;
}
