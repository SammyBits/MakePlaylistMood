import express from "express";
import redis from "redis";
import sqlite3 from "sqlite3";
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === "development" ? ".env.development" : ".env";
dotenv.config({ path: envFile });

const app = express();
const port = process.env.EXPRESS_PORT || 3000;
