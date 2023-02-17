import {
    PlayerGender,
    Language,
    PlayerStatus,
    PlayerVisibility,
} from "../utilities/enums/userEnum";

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

export interface PlayerTeam {
    authId: string;
    role: string;
    firstName: string;
    lastName: string;
    gender: string;
    status: string;
    image: string;
}
