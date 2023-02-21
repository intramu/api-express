import { Sport } from "../utilities/enums/commonEnum";
import { TeamGender, TeamStatus, TeamVisibility } from "../utilities/enums/teamEnum";

export interface ITeamDatabase {
    id: number;
    name: string;
    wins: number;
    ties: number;
    losses: number;
    image: string;
    visibility: TeamVisibility;
    sport: Sport;
    gender: TeamGender;
    date_created: Date;
    sportsmanship_score: number;
    status: TeamStatus;
    max_team_size: number;
    organization_id: string;
    bracket_id: number;
}

export interface ITeamCreate {
    name: string;
    image: string;
    visibility: TeamVisibility;
    sport: Sport;
    bracketId: number;
}
