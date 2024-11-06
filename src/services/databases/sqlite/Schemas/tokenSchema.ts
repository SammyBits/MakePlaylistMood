import type { Database } from "sqlite3";
import databaseSettings from "../../../../configs/sqliteSettings";

// Define the structure of a token row in the database
interface TokenRow {
  refresh_token: string; // The refresh_token can be null if it does not exist
}

/**
 * Initializes the 'tokens' table in the SQLite database if it does not exist.
 * The table stores refresh tokens with an auto-incremented id.
 * 
 * @example
 * // Call this function on app startup to ensure the table is ready.
 * initializeTokenSchema();
 */
export const initializeTokenSchema = (): void => {
  databaseSettings.run(`CREATE TABLE IF NOT EXISTS tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    refresh_token TEXT
  )`);
};

/**
 * Inserts a new refresh token into the 'tokens' table.
 * If a refresh token already exists, a new entry will be added.
 * 
 * @param {string} refreshToken - The refresh token to insert into the database.
 * This token will be used for refreshing access tokens in the authentication flow.
 * 
 * @example
 * // Insert a refresh token into the database.
 * insertToken("your-refresh-token-here");
 */
export const insertToken = (refreshToken: string): void => {
  databaseSettings.run(
    `INSERT INTO tokens (refresh_token) VALUES (?)`,
    [refreshToken],
    (err) => {
      if (err) {
        console.error("Error inserting token:", err);
        return;
      }
      console.log("Token inserted successfully.");
    }
  );
};

/**
 * Retrieves the most recently inserted refresh token from the 'tokens' table.
 * Returns the last refresh token in the table (sorted by insertion order).
 * 
 * @returns {Promise<TokenRow | null>} A promise that resolves to the most recent refresh token, or null if no token exists.
 * 
 * @example
 * // Retrieve the last inserted refresh token.
 * const token = await getToken();
 * console.log(token); // { refresh_token: 'your-refresh-token-here' }
 */
export const getToken = (): Promise<TokenRow | null> =>
  new Promise((resolve, reject) => {
    databaseSettings.get(
      `SELECT refresh_token FROM tokens ORDER BY id DESC LIMIT 1`,
      (err, row: TokenRow | undefined) => {
        if (err) {
          console.error("Error getting token:", err);
          reject(err);
          return;
        }
        resolve(row || null); // Return the row or null if not found
      }
    );
  });
