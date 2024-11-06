
import dotenv from "dotenv";
import initializeSchema from "./services/databases/sqlite/schemasManager";
import { initializeServerExpress } from "./configs/expressSettings";

// Load environment variables based on the current NODE_ENV (development or production)
const envFile =
  process.env.NODE_ENV === "development" ? ".env.development" : ".env";
// Configure dotenv to load environment variables
dotenv.config({ path: envFile });

// Initialize the database schemas, including creating the necessary tables if they don't exist
initializeSchema();

/**
 * Starts the Express server with all necessary configurations.
 * 
 * This function sets up the server, configures middleware, routes, and other
 * settings required for the application to handle HTTP requests.
 * 
 */
initializeServerExpress();
