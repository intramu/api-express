"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
require("dotenv/config");
const util_1 = require("util");
const winstonConfig_1 = __importDefault(require("../utilities/winstonConfig"));
const testwinston_1 = __importDefault(require("../utilities/testwinston"));
testwinston_1.default.crit("test");
winstonConfig_1.default.error("test");
const pool = mysql_1.default.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
class PlayerDAO {
    createSecondaryPlayer() {
        return __awaiter(this, void 0, void 0, function* () {
            pool.getConnection((err, conn) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err)
                        throw err;
                    let sql = "SELECT * FROM player";
                    conn.query = (0, util_1.promisify)(conn.query);
                    let result = yield conn.query(sql);
                    console.log("test");
                }
                catch (error) {
                    if (error instanceof Error)
                        winstonConfig_1.default.error("Database connection / query error", {
                            type: error.message,
                            class: "playerDao",
                        });
                    return null;
                }
            }));
        });
    }
}
exports.default = PlayerDAO;
let playerdao = new PlayerDAO();
const test = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("is this working");
    let result = playerdao.createSecondaryPlayer();
    winstonConfig_1.default.info("why not", {
        type: "test",
        class: "playerDAO",
    });
    console.log("why not");
});
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
