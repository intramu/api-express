import { TeamRole } from "../utilities/enums/teamEnum";
import {
    PlayerGender,
    Language,
    PlayerStatus,
    PlayerVisibility,
} from "../utilities/enums/userEnum";

interface BasePlayerDetails {
    firstName: string;
    lastName: string;
    language: Language;
    emailAddress: string;
    gender: PlayerGender;
    dob: Date;
    visibility: PlayerVisibility;
    image: string;
}

export interface IPlayerDatabase {
    auth_id: string;
    first_name: string;
    last_name: string;
    language: Language;
    email_address: string;
    gender: PlayerGender;
    dob: Date;
    visibility: PlayerVisibility;
    graduation_term: string;
    image: string;
    status: PlayerStatus;
    // organizationId: string;
    date_created: Date;
}

export type PlayerPatch = BasePlayerDetails;

export interface IPlayerTeam {
    authId: string;
    role: string;
    firstName: string;
    lastName: string;
    gender: string;
    status: string;
    image: string;
}

export interface IPlayerTeamDatabase {
    auth_id: string;
    role: TeamRole;
    first_name: string;
    last_name: string;
    gender: PlayerGender;
    status: PlayerStatus;
    image: string;
}
