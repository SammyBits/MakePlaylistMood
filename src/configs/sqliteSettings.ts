import sqlite3 from "sqlite3";
import path from "path"; // Import the path module to handle file paths

/**
 * Resolves the file path for the SQLite database (`tokens.db`) using `path.resolve()`.
 * The database file is located in the parent directory, two levels above the current file.
 */
const dbPath = path.resolve(__dirname, "../../tokens.db");

/**
 * Creates a new SQLite database connection using the resolved database file path.
 * If the database does not exist, it will be created.
 * The connection is established asynchronously.
 *
 * @example
 * const db = new sqlite3.Database('path/to/tokens.db');
 */
const databaseSettings = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

/**
 * Exports the SQLite database connection for use in other parts of the application.
 * The `databaseSettings` object allows for executing SQL queries and managing the database.
 */
export default databaseSettings;
