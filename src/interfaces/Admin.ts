import { Language, Role, Status } from "../utilities/enums";

export interface AdminDatabaseInterface {
    auth_id: string;
    first_name: string;
    last_name: string;
    language: Language;
    email_address: string;
    role: Role;
    date_created: Date;
    status: Status;
    organization_id: string;
}

export interface AdminNew {
    firstName: string;
    lastName: string;
    language: Language;
    emailAddress: string;
}
