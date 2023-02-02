import {
    ContestType,
    PlayoffSeedingType,
    Status,
    TournamentType,
    Visibility,
} from "../utilities/enums";

export interface ContestNew {
    name: string;
    visibility: Visibility;
    status: Status;
    startDate: Date;
    endDate: Date;
    playoff: boolean;
    playoffType: TournamentType;
    playoffSeedingType: PlayoffSeedingType;
    contestType: ContestType;
}

export interface ContestDatabaseInterface {
    id: number;
    name: string;
    visibility: Visibility;
    date_created: Date;
    status: Status;
    start_date: Date;
    end_date: Date;
    playoff: boolean;
    playoff_type: TournamentType;
    playoff_seeding_type: PlayoffSeedingType;
    contest_type: ContestType;
    organization_id: string;
}
