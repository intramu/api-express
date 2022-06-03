import mysql from "mysql";
import "dotenv/config";
import { promisify } from "util";
import logger from "../utilities/winstonConfig";

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default class PlayerDAO {
    async createSecondaryPlayer() {
        pool.getConnection(async (err: any, conn: any) => {
            try {
                if (err) throw err;

                let sql = "SELECT * FROM player";

                conn.query = promisify(conn.query);
                let result = await conn.query(sql);

                console.log("test");
            } catch (error) {
                if (error instanceof Error)
                    logger.error("Database connection / query error", {
                        type: error.message,
                        class: "playerDao",
                    });
                return null;
            }
        });
    }
}

let playerdao = new PlayerDAO();
const test = async () => {
    console.log("is this working");

    let result = playerdao.createSecondaryPlayer();

    logger.info("why not", {
        type: "test",
        class: "playerDAO",
    });
    console.log("why not");
};
test();

// const pool = mysql2.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// export default class playerDAO {
//     public createPrimary(player: Player, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(err);
//                 callback(null);
//                 return;
//             }

//             let sql =
//                 "INSERT INTO player (DATE, FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PASSWORD, ROLE) VALUES (?,?,?,?,?,?)";

//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [
//                     new Date(),
//                     player.$firstName,
//                     player.$lastName,
//                     player.$emailAddress,
//                     player.$password,
//                     player.$role,
//                 ]);

//                 callback(result.insertId);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//         });
//     }

//     public createSecondary(player: Player, callback: any) {
//         pool.getConnection(async (err: any, conn: any) => {
//             try {
//                 if (err) throw err;
//             } catch (error) {
//                 console.log(err);
//                 callback(null);
//                 return;
//             }

//             let sql =
//                 "UPDATE player SET GENDER=?, DOB=?, LANGUAGE=?, PROFILE_VISIBILITY=?, GRADUATION_DATE=?, YEAR=?,PROFILE_PICTURE=?, STATUS=? INTO player (DATE, FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PASSWORD, ROLE, university_ID) VALUES (?,?,?,?,?)";

//             try {
//                 conn.query = util.promisify(conn.query);
//                 var result = await conn.query(sql, [
//                     // admin.$firstName,
//                     // admin.$lastName,
//                     // admin.$emailAddress,
//                     // admin.$password,
//                     // 1,
//                 ]);

//                 callback(result.insertId);
//             } catch (error) {
//                 console.log(error);
//                 callback(null);
//                 return;
//             }
//         });
//     }
// }
