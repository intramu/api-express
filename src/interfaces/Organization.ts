import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import { Status } from "../utilities/enums";

export interface OrganizationDatabaseInterface {
    id: string;
    name: string;
    image: string;
    info: string;
    main_color: string;
    approval_status: Status;
    date_created: Date;
}

export interface OrganizationWithAdmin {
    admin: Admin;
    organization: Organization;
}

export interface OrganizationNew {
    name: string;
    image: string;
    info: string;
    main_color: string;
}
