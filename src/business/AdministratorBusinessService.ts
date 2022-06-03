// import adminDAO from "../database/adminDAO";
// import { Administrator } from "../models/Administrator";

// const database = new adminDAO();

// export class AdministratorBusinessService {
//     public createAdmin(admin: Administrator, callback: any) {
//         database.createAdmin(admin, (result: any) => {
//             if (result == null) {
//                 console.log("Database Error");
//                 callback({ message: "Admin NOT Created", code: -1 });
//             } else if (result > 0)
//                 callback({ message: "Admin Created", code: result });
//             else callback({ message: "Admin NOT Created", code: 0 });
//         });
//     }

//     public login(emailAddress: string, password: string, callback: any) {
//         database.login(emailAddress, password, (result: any) => {
//             if (result === null) {
//                 console.log("Database Error");
//                 callback({ message: "Login Failed", code: -1 });
//             } else if (result === undefined)
//                 callback({ message: "Login Failed", code: 0 });
//             else {
//                 callback({
//                     message: "Login Success",
//                     code: result.ID,
//                     content: result.FIRST_NAME,
//                 });
//             }
//         });
//     }

//     async findAdmin(id: number, callback: any) {
//         database.findAdmin(id, (result: any) => {
//             // console.log(result);

//             callback(result);
//         });
//     }

//     public findAllTeams(callback: any) {
//         console.log("In business");

//         database.findAllTeams((result: any) => {
//             if (result === null) {
//                 console.log("Database Error");
//                 callback({ message: "No Teams Found", code: -1 });
//                 return;
//             }

//             if (result === undefined)
//                 callback({ message: "No Teams Found", code: 0 });
//             else callback({ message: "Teams Found", code: 1, content: result });
//         });
//     }

//     public findTeamById(id: number, callback: any) {
//         database.findTeamById(id, (result: any) => {
//             if (result === null) {
//                 console.log("Database Error");
//                 callback({ message: "No Team Found", code: -1 });
//                 return;
//             }

//             if (result === undefined)
//                 callback({ message: "No Team Found", code: 0 });
//             else callback({ message: "Team Found", code: 1, content: result });
//         });
//     }

//     public createTeam(name: string, callback: any) {
//         database.createTeam(name, (result: any) => {
//             if (result == null) {
//                 console.log("Database Error");
//                 callback({ message: "Create Failure", code: 0 });
//             } else callback({ message: "Create Success", code: result });
//         });
//     }

//     public joinTeam(playerId: number, teamId: number, callback: any) {
//         database.findTeamRestrictions(teamId, (result: any) => {
//             if (result === null) {
//                 console.log("Database Error");
//                 callback(null);
//                 return;
//             }

//             if (result === undefined) callback("no team");
//             else {
//                 if (result.OPEN_TO_PLAYERS == 0) callback("reject");
//                 else {
//                     database.joinTeam(playerId, teamId, (result: any) => {
//                         // console.log(result);
//                         if (result > 0) callback("success");
//                         else callback("failure");
//                     });
//                 }
//             }
//         });
//     }
//     // public createAdmin(
//     //     masterId: number,
//     //     masterPassword: string,
//     //     admin: Administrator,
//     //     callback: any
//     // ) {
//     //     administratorDAO.getAdminRole(
//     //         masterId,
//     //         masterPassword,
//     //         (result: any) => {
//     //             switch (result) {
//     //                 case null:
//     //                     console.log("Incorrect details entered");
//     //                     callback("Incorrect details entered");
//     //                     break;
//     //                 case "slave":
//     //                     console.log("Insufficient privileges");
//     //                     callback("Insufficient privileges");
//     //                     break;
//     //                 case "master":
//     //                     console.log("Sufficient privileges");
//     //                     administratorDAO.createAdmin(admin, (result2: any) => {
//     //                         if (result2 == "error") {
//     //                             console.log("Error");
//     //                             callback("error");
//     //                             return;
//     //                         }
//     //                         if (result2 == 1) {
//     //                             console.log("Admin Created");
//     //                             callback("Admin Created");
//     //                         } else {
//     //                             console.log("Error inserting admin");
//     //                             callback("Admin NOT Created");
//     //                         }
//     //                     });
//     //                     break;
//     //                 default:
//     //                     console.log("Unhandled Error");
//     //                     callback("Unhandled Error");
//     //                     break;
//     //             }
//     //         }
//     //     );
//     // }
//     // public findAllAdmins(callback: any) {
//     //     administratorDAO.findAllAdmins((result: any) => {
//     //         if (result == "error") callback({ message: "null" });
//     //         else callback(result);
//     //     });
//     // }
//     // public removeAdmin(
//     //     masterId: number,
//     //     masterPassword: string,
//     //     id: number,
//     //     callback: any
//     // ) {
//     //     administratorDAO.getAdminRole(
//     //         masterId,
//     //         masterPassword,
//     //         (result: any) => {
//     //             switch (result) {
//     //                 case null:
//     //                     console.log("Incorrect details entered");
//     //                     callback("Incorrect details entered");
//     //                     break;
//     //                 case "slave":
//     //                     console.log("Insufficient privileges");
//     //                     callback("Insufficient privileges");
//     //                     break;
//     //                 case "master":
//     //                     console.log("Sufficient privileges");
//     //                     administratorDAO.removeAdmin(id, (result2: any) => {
//     //                         if (result2 == "error") callback("error");
//     //                         else if (result2 > 0) callback("Admin Removed");
//     //                         else callback("Admin NOT Removed");
//     //                     });
//     //                     break;
//     //                 default:
//     //                     console.log("Unhandled Error");
//     //                     callback("Unhandled Error");
//     //                     break;
//     //             }
//     //         }
//     //     );
//     // }
//     // public removeAdmin(currentId: number, password: string, otherId: number, callback: any){
//     //     administratorDAO.getAdminRole(currentId, password, (err:any, result: any) => {
//     //         if(err){
//     //             // console.log(err);
//     //             throw err;
//     //         }
//     //         switch (result) {
//     //             case null:
//     //                 console.log('Incorrect details entered');
//     //                 break;
//     //             case 'slave':
//     //                 console.log('Insufficient privileges');
//     //                 break;
//     //             case 'master':
//     //                 console.log('Sufficient privileges');
//     //                 administratorDAO.removeAdmin(otherId, (err: any, result:any)=>{
//     //                     if(err)
//     //                         throw err;
//     //                     switch (result) {
//     //                         case 1:
//     //                             console.log('Admin Deleted');
//     //                             break;
//     //                         case 0:
//     //                             console.log('Admin number does not exist');
//     //                             break;
//     //                         default:
//     //                             console.log('Unhandled Error');
//     //                             break;
//     //                     }
//     //                 })
//     //                 break;
//     //             default:
//     //                 console.log('Unhandled Error');
//     //                 break;
//     //         }
//     //     })
//     // }
//     // public findAdmin(id: number, callback: any) {
//     //     administratorDAO.findAdmin(id, (result: any) => {
//     //         switch (result) {
//     //             case Object:
//     //                 console.log("Object returned");
//     //                 break;
//     //             case null:
//     //                 console.log("No admin found");
//     //                 break;
//     //             default:
//     //                 console.log("Unhandled error");
//     //                 break;
//     //         }
//     //     });
//     // }
//     // async updateAdmin(admin: Administrator){
//     //     const result = await administratorDAO.updateAdmin(admin);
//     //     switch(result){
//     //         case 'success':
//     //             console.log('Admin updated');
//     //             break;
//     //         case 'failure':
//     //             console.log('Admin not updated');
//     //             break;
//     //         case 'error':
//     //             console.log('Database error');
//     //             break;
//     //     }
//     // }
//     // async findAllAdmins(){
//     //     const result = await administratorDAO.findAllAdmins();
//     //     switch(result){
//     //         case 'failure':
//     //             console.log('No admins found');
//     //         case 'error':
//     //             console.log('Database error');
//     //         default:
//     //             console.log(result);
//     //     }
//     // }
// }
