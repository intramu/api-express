import { PlayerSmall } from "../models/PlayerSmall";
import { Sport } from "../utilities/enums/commonEnum";
import { TeamGender, TeamRole, TeamStatus, TeamVisibility } from "../utilities/enums/teamEnum";
import { IPlayerTeamDatabase } from "./IPlayer";

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
    players: IPlayerTeamDatabase[];
    organization_id: string;
    bracket_id: number;
}

export interface ITeamRosterDatabase {
    player_id: string;
    team_id: number;
    role: TeamRole;
}

export interface ITeamRoster {
    playerId: string;
    teamId: number;
    role: TeamRole;
}
