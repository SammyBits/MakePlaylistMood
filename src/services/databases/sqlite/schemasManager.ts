import databaseSettings from "../../../configs/sqliteSettings";
import { initializeTokenSchema } from "./Schemas/tokenSchema";

export const initializeSchema = (): void => {
  initializeTokenSchema();
};

export default initializeSchema;
