import { League } from "../models/competition/League";
import {
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
    date_created: Date;
    status: CompetitionStatus;
    start_date: Date;
    end_date: Date;
    playoff: boolean;
    playoff_type: TournamentType;
    playoff_seeding_type: PlayoffSeedingType;
    leagues: League[];
    contest_type: ContestType;
    organization_id: string;
}
