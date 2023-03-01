import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";
import { OrganizationStatus } from "../utilities/enums/commonEnum";
import { IAdmin, IAdminDatabase, IAdminNew } from "./IAdmin";

export interface IOrganizationDatabase {
    id: string;
    name: string;
    image: string;
    info: string;
    main_color: string;
    approval_status: OrganizationStatus;
    date_created: Date;
}

export interface IOrganization {
    name: string;
    image: string;
    info: string;
    mainColor: string;
    approvalStatus: OrganizationStatus;
}

export interface IOrganizationWithAdmin {
    admin: IAdmin;
    organization: IOrganization;
}

export interface IOrganizationNew {
    id: string;
    name: string;
    image: string;
    info: string;
    mainColor: string;
    approvalStatus: OrganizationStatus;
    dateCreated: Date;
}

export interface IOrganizationWithAdminDatabase {
    admin: Admin;
    organization: Organization;
}
