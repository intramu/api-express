import { Gender, Language, Role, Status, Visibility } from "../utilities/enums";

export interface PlayerNew {
    authId: string;
    firstName: string;
    lastName: string;
    language: Language;
    emailAddress: string;
    role: Role;
    gender: Gender;
    dob: Date;
    visibility: Visibility;
    graduationTerm: string;
    image: string;
    status: Status;
    organizationId: string;
}
