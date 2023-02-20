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

export interface IPlayerProps {
    authId: string;
    firstName: string;
    lastName: string;
    language: Language;
    emailAddress: string;
    gender: PlayerGender;
    dob: Date;
    visibility: PlayerVisibility;
    graduationTerm: string;
    image: string;
    status: PlayerStatus;
    // organizationId: string;
    dateCreated: Date;
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

export interface PlayerPatchService extends BasePlayerDetails {
    authId: string;
    graduationTerm: string;
    status: PlayerStatus;
}

export interface PlayerTeam {
    authId: string;
    role: string;
    firstName: string;
    lastName: string;
    gender: string;
    status: string;
    image: string;
}
