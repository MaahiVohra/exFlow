module.exports = {
    databaseUrl: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
    migrationsTable: "pgmigrations", // Table to track migrations
    dir: "migrations", // Directory where migrations will be stored
    direction: "up", // Default migration direction (up or down)
};
