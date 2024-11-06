import databaseSettings from "../../../configs/sqliteSettings";
import { initializeTokenSchema } from "./Schemas/tokenSchema";

/**
 * Initializes all necessary database schemas, including creating the 'tokens' table.
 * This function is responsible for setting up the database schema at application startup.
 * 
 * It calls the `initializeTokenSchema` function to ensure the `tokens` table exists in the database.
 * Additional schema initialization functions can be added to this method as the application grows.
 * 
 * @example
 * // Call this function at the beginning of the application to initialize the schemas.
 * initializeSchema();
 */
export const initializeSchema = (): void => {
  // Initializes the token schema (table creation)
  initializeTokenSchema();
};

export default initializeSchema;
