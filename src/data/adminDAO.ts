import mysql2 from "mysql2";
import { Competition } from "../models/Competition";
import logger from "../utilities/winstonConfig";


const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default class adminDAO {
    className = this.constructor.name;

    async createCompetition_Tournament(organizationId: string, competition: Competition){
        logger.verbose("Entering method createCompetition_Tournament()",{
            class: this.className
        })

        let conn = null
        let sql = ""
    }
}
