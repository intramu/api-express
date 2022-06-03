"use strict";
// import mysql2 from "mysql2";
// import { promisify } from "util";
// import { Administrator } from "../models/Administrator";
// import { Organization } from "../models/Organization";
// const pool = mysql2.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });
// export default class organizationDAO {
//     public createOrganization(
//         organization: Organization,
//         admin: Administrator,
//         callback: any
//     ) {
//         pool.getConnection((err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//             conn.beginTransaction(async (err: any) => {
//                 try {
//                     if (err) throw err;
//                 } catch (error) {
//                     console.log(error);
//                     callback(null);
//                     return;
//                 }
//                 let sql1 =
//                     "INSERT INTO organization (ID, NAME, LOGO, PRIMARY_COLOR, ACCENT_COLOR, STATUS) VALUES(?,?,?,?,?,?)";
//                 let sql2 =
//                     "INSERT INTO administrator (ID, FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PASSWORD,  PHONE_NUMBER, university_ID) VALUES(?,?,?,?,?,?, ?) ";
//                 try {
//                     conn.query = promisify(conn.query);
//                     let orgResult = await conn.query(sql1, [
//                         0,
//                         organization.$name,
//                         organization.$logo,
//                         organization.$primaryColor,
//                         organization.$accentColor,
//                         organization.$status,
//                     ]);
//                     // console.log(orgResult);
//                     let adminResult = await conn.query(sql2, [
//                         0,
//                         admin.$firstName,
//                         admin.$lastName,
//                         admin.$emailAddress,
//                         admin.$password,
//                         admin.$phoneNumber,
//                         orgResult.insertId,
//                     ]);
//                     // console.log(adminResult);
//                     conn.commit((err: any) => {
//                         if (err) {
//                             callback(0);
//                             conn.rollback();
//                             throw err;
//                         }
//                         callback(1);
//                     });
//                 } catch (error) {
//                     console.log(error);
//                     conn.rollback();
//                     callback(null);
//                 }
//             });
//         });
//     }
// }
