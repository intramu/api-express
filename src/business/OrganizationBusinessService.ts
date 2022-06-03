// import organizationDAO from "../database/organizationDAO";
// import { Administrator } from "../models/Administrator";
// import { Organization } from "../models/Organization";
// const database = new organizationDAO();

// export class OrganizationBusinessService {
//     /**
//      * Create organization will utilize the organizationDAO and adminDAO dataservices to create the organization and master admin.
//      * @param organization Organization object submitted to database
//      * @param admin Master admin object created with the organization
//      * @param callback returns result from database
//      */
//     public createOrganization(
//         organization: Organization,
//         admin: Administrator,
//         callback: any
//     ) {
//         database.createOrganization(organization, admin, (result: any) => {
//             if (result === null) {
//                 console.log("Database Error");
//                 callback({ message: "Organization NOT created", code: 0 });
//                 return;
//             }

//             if (result > 0)
//                 callback({ message: "Organization created", code: 1 });
//             else callback({ message: "Organization NOT created", code: 0 });
//         });
//     }
// }
