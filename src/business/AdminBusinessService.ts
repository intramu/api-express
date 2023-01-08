import AdminDAO from "../data/adminDAO";
import { Admin } from "../models/Admin";
import { Organization } from "../models/Organization";

const adminData = new AdminDAO();

export class AdminBusinessService
{
    async createOrganization(org: Organization)
    {
        const result = await adminData.createOrganization(org)   
        
        if(result < 1){
            return({message: "Database Error", code: -1})
        }
        return({message: `Organization ${org.getName()} created`, code: 1})
    }

    async findAllOrganizations()
    {
        const result = await adminData.findAllOrganizations();

        return({message: `${result.length} organizations found`, package: result, code: 1})
    }

    async findOrganizationById(id: string){
        const result = await adminData.findOrganizationById(id)

        return({message: 'One Organization found', package: result, code :1})
    }

    async deleteOrganizationById(id: string){
        const result = await adminData.deleteOrganizationById(id);

        return({message: `Organization deleted with id: ${id}`, code: 1})
    }

    async updateOrganization(org: Organization){
        const result = await adminData.updateOrganization(org);

        console.log(result);
        
        if(result === undefined){
            return({message: `No Organization found with id ${org.getId()}`, code: -2})
        }

        return ({message: `Organization ${org.getId()} updated`, code: 1})
    }
}