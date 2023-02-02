import { TimeSlotInterface } from "./TimeSlot";

export interface BracketNewInterface {
    dayChoices: string[];
    maxTeamAmount: number;
    timeSlots: TimeSlotInterface[];
    // teams: number[];
}

export interface BracketDatabaseInterface {
    id: number;
    day_choices: string[];
    max_team_amount: number;
    division_id: number;
}
