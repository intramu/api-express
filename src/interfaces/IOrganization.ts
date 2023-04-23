import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import { OrganizationStatus } from "../utilities/enums/commonEnum";
import { IAdmin } from "./IAdmin";

export interface IOrganizationDatabase {
    id: string;
    name: string;
    image: string;
    info: string;
    main_color: string;
    approval_status: OrganizationStatus;
    primary_contact_email: string;
    notes: string;
    date_created: Date;
}

export interface IOrganization {
    name: string;
    image: string;
    info: string;
    mainColor: string;
    approvalStatus: OrganizationStatus;
}

export type OrganizationWithAdmin = {
    admin: Admin & { password: string };
    organization: Organization;
};

export interface IOrganizationWithAdmin {
    organization: IOrganization;
    admin: IAdmin;
}
