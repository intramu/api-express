import { TimeSlotInterface } from "./TimeSlot";

export interface BracketNewInterface {
    dayChoices: string[];
    maxTeamAmount: number;
    timeSlots: TimeSlotInterface[];
    // teams: number[];
}

export interface TimeRange {
    startTime: Date;
    endTime: Date;
}

export interface IBracketDatabase {
    id: number;
    day_choices: string[];
    time_choices: string;
    max_team_amount: number;
    division_id: number;
}
