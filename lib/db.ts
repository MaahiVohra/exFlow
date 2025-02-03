import { Pool } from "pg";

let conn;
const port = process.env.PGPORT ?? 5432;

if (!conn) {
    conn = new Pool({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: Number(port),
        database: process.env.PGDATABASE,
        ssl: true,
    });
}

const db = conn;
export default db;
