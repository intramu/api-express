import { League } from "../models/competition/League";
import {
    CompetitionSeason,
    CompetitionStatus,
    CompetitionVisibility,
    ContestType,
    PlayoffSeedingType,
    TournamentType,
} from "../utilities/enums/competitionEnum";

export interface ContestNew {
    name: string;
    visibility: CompetitionVisibility;
    status: CompetitionStatus;
    startDate: Date;
    endDate: Date;
    playoff: boolean;
    playoffType: TournamentType;
    playoffSeedingType: PlayoffSeedingType;
    contestType: ContestType;
}

export interface IContestDatabase {
    id: number;
    name: string;
    visibility: CompetitionVisibility;
    status: CompetitionStatus;
    season: CompetitionSeason;
    term: number;
    year: string;
    date_created: Date;
    // leagues: League[];
    organization_id: string;
}
