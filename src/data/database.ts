import { Pool } from 'pg';

const pool = new Pool({
    user: 'noahr',
    host: 'localhost',
    database: 'noahr',
    password: 'root',
    port: 5432,
    max: 20,
})

module.exports = pool