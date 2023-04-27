import { Location } from "../models/Location";
import { Team } from "../models/Team";
import { ContestGameStatus } from "../utilities/enums/competitionEnum";

export interface IContestGameDatabase {
    id: number;
    date_created: Date;
    game_date: Date | null;
    notes: string;
    score_home: number | null;
    score_away: number | null;
    status_home: ContestGameStatus;
    status_away: ContestGameStatus;
    location: Location;
    home_team: Team;
    away_team: Team;
}

export interface IContestGameReport {
    id: number;
    scoreHome: number;
    scoreAway: number;
    statusHome: ContestGameStatus;
    statusAway: ContestGameStatus;
}
