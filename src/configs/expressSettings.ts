import express, { Request, Response } from "express";
import morgan from "morgan";
import SpotifyWebApi from "spotify-web-api-node";
import spotifyApi from "./spotifySettings";
import redisClient from "./redisSettings";
import databaseSettings from "./sqliteSettings";
import { insertToken } from "../services/databases/sqlite/Schemas/tokenSchema";

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/v1/login", (req: Request, res: Response) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(
    ["user-read-private", "playlist-modify-public"],
    "state",
    true
  );
  res.redirect(authorizeURL);
});

app.get("/api/v1/callback", async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }
  try {
    const data = await spotifyApi.authorizationCodeGrant(code as string);
    const { access_token, refresh_token } = data.body;
    // Guardar el token de acceso en Redis
    redisClient.set("access_token", access_token, { EX: 3600 });
    // Insertar el refresh token en SQLite
    insertToken(refresh_token);
    res.send("¡Authentication Successful!");
  } catch (error: any) {
    console.error("Error getting tokens from Spotify:", error.message);
    res.status(500).json({ error: error.message });
  }
});
// Middleware para manejar errores
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

export const initializeServerExpress = () => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
