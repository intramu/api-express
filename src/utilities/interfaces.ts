import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";

export interface OrgWithAdmin {
    admin: Admin;
    organization: Organization;
}
