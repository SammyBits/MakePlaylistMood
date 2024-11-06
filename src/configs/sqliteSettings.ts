import sqlite3 from "sqlite3";
import path from "path"; // Importa el módulo path para manejar rutas

const dbPath = path.resolve(__dirname, "../../tokens.db");

const databaseSettings = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

export default databaseSettings;
