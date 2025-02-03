import { readdir, readFile } from "fs/promises";
import path from "path";
import { Client } from "pg";

const DATABASE_URL = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}/${process.env.PGDATABASE}?sslmode=require`;

// PostgreSQL client setup
const client = new Client({
    connectionString: DATABASE_URL,
});

// Function to run a migration file
const runMigration = async (file: string) => {
    const filename = path.basename(file);
    try {
        // Check if migration table exists, create if not
        await client.query(`
			CREATE TABLE IF NOT EXISTS applied_migrations (
				filename TEXT PRIMARY KEY,
				applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);

        // Check if migration has already been applied
        const { rows } = await client.query(
            "SELECT filename FROM applied_migrations WHERE filename = $1",
            [filename]
        );

        if (rows.length > 0) {
            console.log(`Migration already applied: ${filename}`);
            return;
        }

        // Run the migration
        const sqlContent = await readFile(file, "utf-8");
        console.log(`Running migration: ${filename}`);
        await client.query(sqlContent);

        // Record the applied migration
        await client.query(
            "INSERT INTO applied_migrations (filename) VALUES ($1)",
            [filename]
        );

        console.log(`Migration successful: ${filename}`);
    } catch (error) {
        console.error(`Error in migration ${filename}:`, error);
        throw error;
    }
};

// Load all migration files from the migrations folder
const loadMigrations = async (): Promise<string[]> => {
    const migrationsDir = path.join(__dirname, "..", "migrations");
    const files = await readdir(migrationsDir);
    return files
        .filter((file) => file.endsWith(".sql")) // Filter only .sql files
        .map((file) => path.join(migrationsDir, file)) // Get full path
        .sort((a, b) => a.localeCompare(b)); // Sort using localeCompare
};

// Apply migrations sequentially
const runMigrations = async () => {
    try {
        await client.connect(); // Connect to the database
        const migrations = await loadMigrations();
        for (const migration of migrations) {
            await runMigration(migration);
        }
        console.log("All migrations applied successfully!");
    } catch (error) {
        console.error("Migration process failed:", error);
    } finally {
        await client.end(); // Ensure the client is closed
    }
};

// Execute the migrations
runMigrations();
