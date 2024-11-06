import express from "express";
import redis from "redis";
import sqlite3 from "sqlite3";
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
import databaseSettings from "./configs/sqliteSettings";
import initializeSchema from "./services/databases/sqlite/schemasManager";
import { initializeServerExpress } from "./configs/expressSettings";
const envFile =
  process.env.NODE_ENV === "development" ? ".env.development" : ".env";
dotenv.config({ path: envFile });
initializeSchema();
initializeServerExpress();
