import type { Database } from "sqlite3";
import databaseSettings from "../../../../configs/sqliteSettings";

export const initializeTokenSchema = (): Database =>
  databaseSettings.run(`CREATE TABLE IF NOT EXISTS tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      refresh_token TEXT
    )`);

export const insertToken = (refreshToken: string): Database =>
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

export const getToken = (): Database =>
  databaseSettings.get(`SELECT * FROM tokens`);
