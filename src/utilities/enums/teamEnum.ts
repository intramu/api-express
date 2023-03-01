import { DivisionType } from "./competitionEnum";

/** Enums related to team object */
export enum TeamRole {
    CAPTAIN = "CAPTAIN",
    COCAPTAIN = "COCAPTAIN",
    PLAYER = "PLAYER",
}

export enum TeamStatus {
    UNELIGIBLE = "UNELIGIBLE",
    ELIGIBLE = "ELIGIBLE",
    BANNED = "BANNED",
    FINISHED = "FINISHED",
}

export enum TeamVisibility {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
}

export type TeamGender = DivisionType;
