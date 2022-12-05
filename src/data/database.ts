import { Pool } from "pg";

export default new Pool({
    user: "noahr",
    host: "localhost",
    database: "noahr",
    password: "root",
    port: 5432,
    max: 20,
});
