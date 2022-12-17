import AdminDAO from "../data/adminDAO";
import { Organization } from "../models/Organization";

const adminData = new AdminDAO();

export class AdminBusinessService
{
    async createOrganization(org: Organization)
    {
        const result = adminData.createOrganization(org)        
        console.log(result);
        
    }
}