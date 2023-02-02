import { Sport, Status, Visibility } from "../utilities/enums";

export interface TeamDatabaseInterface {
    id: number;
    name: string;
    wins: number;
    ties: number;
    losses: number;
    image: string;
    visibility: Visibility;
    sport: Sport;
    date_created: Date;
    sportsmanship_score: number;
    status: Status;
    max_team_size: number;
    organization_id: string;
    bracket_id: number;
}
