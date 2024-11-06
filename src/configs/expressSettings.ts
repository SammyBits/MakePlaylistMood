import express, { Request, Response } from "express";
import morgan from "morgan";
import SpotifyWebApi from "spotify-web-api-node";
import spotifyApi from "./spotifySettings"; // Configuration of Spotify API instance
import redisClient from "./redisSettings"; // Redis client for caching
import databaseSettings from "./sqliteSettings"; // SQLite database configuration
import {
  getToken,
  insertToken,
} from "../services/databases/sqlite/Schemas/tokenSchema"; // Functions to interact with the SQLite database
import { extractKeywords } from "../services/AI/KeywordsServices"; // AI service to extract keywords from user prompt

// Initialize the Express application and set up the port
const app = express();
const port = process.env.EXPRESS_PORT || 3000; // Use environment variable or default to 3000

// Middleware for handling JSON requests, URL encoding, and logging HTTP requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Route for logging in to Spotify and redirecting to authorization page
app.get("/api/v1/login", (req: Request, res: Response) => {
  const authorizeURL = spotifyApi.createAuthorizeURL(
    ["user-read-private", "playlist-modify-public", "playlist-modify-private"], // Scopes for accessing user data and modifying playlists
    "state", // A random state parameter to protect against CSRF
    true // Enable show_dialog to force the user to log in
  );
  res.redirect(authorizeURL); // Redirect user to Spotify login page
});

// Callback route to handle the authorization code from Spotify
app.get("/api/v1/callback", async (req: Request, res: Response) => {
  const { code } = req.query; // Retrieve the authorization code from the query parameters
  if (!code) {
    return res.status(400).json({ error: "Missing code" }); // Return error if no code is provided
  }
  try {
    const data = await spotifyApi.authorizationCodeGrant(code as string); // Use the code to request access and refresh tokens
    const { access_token, refresh_token } = data.body;

    // Set the access token in the Spotify API instance
    spotifyApi.setAccessToken(access_token);

    // Store the access token in Redis for quick access
    redisClient.set("access_token", access_token, { EX: 3600 }); // The token will expire in 1 hour

    // Store the refresh token in SQLite for future use
    insertToken(refresh_token);

    res.send("Authentication Successful!"); // Send a success message to the user
  } catch (error: any) {
    console.error("Error getting tokens from Spotify:", error.message);
    res.status(500).json({ error: error.message }); // Return error if authentication fails
  }
});

// Route to refresh the access token using the refresh token stored in the database
app.get("/api/v1/refresh", async (req: Request, res: Response) => {
  try {
    // Retrieve the refresh token from the SQLite database
    const refreshToken = await getToken();
    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh token found" }); // Return error if no refresh token is available
    }

    // Verify the refresh token is valid
    if (!refreshToken.refresh_token) {
      return res.status(400).json({ error: "Invalid refresh token" }); // Return error if the refresh token is invalid
    }

    // Use the refresh token to get a new access token
    const data = spotifyApi.refreshAccessToken((err, data) => {
      if (err) {
        console.error("Error refreshing token:", err.message);
        res.status(500).json({ error: err.message }); // Return error if refreshing the token fails
      }
      const { access_token } = data.body;

      // Store the new access token in Redis
      redisClient.set("access_token", access_token, { EX: 3600 });

      return access_token; // Return the new access token
    });
  } catch (error: any) {
    console.error("Error refreshing token:", error.message);
    res.status(500).json({ error: error.message }); // Return error if something goes wrong
  }
});

// Route to create a new playlist based on the user’s prompt
app.post("/api/v1/create-playlist", async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt as string; // Get the prompt from the request body
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" }); // Return error if no prompt is provided
    }

    // Retrieve the access token from Redis
    const access_token = await redisClient.get("access_token");
    if (!access_token) {
      return res.status(401).json({ error: "No access token found" }); // Return error if no access token is found
    }

    // Set the access token in the Spotify API instance
    spotifyApi.setAccessToken(access_token);

    // Step 1: Extract keywords from the user's prompt using the AI service
    const keywords = await extractKeywords(prompt);
    if (keywords.length === 0) {
      return res.status(400).json({ error: "No keywords extracted" }); // Return error if no keywords were extracted
    }

    console.log("Extracted keywords:", keywords); // Log the extracted keywords for debugging

    // Step 2: Search for tracks on Spotify that match the extracted keywords
    const searchResults = await spotifyApi.searchTracks(keywords.join(" "), {
      limit: 10, // Limit the number of tracks returned
    });

    if (searchResults === undefined) {
      return res.status(500).json({ error: "Error searching tracks" }); // Return error if searching tracks fails
    }

    const tracks = searchResults.body.tracks?.items;
    if (!tracks) {
      return res.status(500).json({ error: "Error fetching tracks" }); // Return error if no tracks are found
    }
    if (tracks.length === 0) {
      return res.status(404).json({ error: "No tracks found for the given keywords" }); // Return error if no tracks match the keywords
    }

    // Step 3: Create a new playlist with the extracted keywords as the playlist description
    const playlistName = `Playlist based on "${prompt}"`;
    const playlistDescription = `A playlist generated based on the following keywords: ${keywords.join(", ")}`;
    const playlist = await spotifyApi.createPlaylist(playlistName, {
      description: playlistDescription,
      public: false, // Set the playlist to private (change this if needed)
    });

    // Step 4: Add the found tracks to the newly created playlist
    const trackUris = tracks.map((track) => track.uri);
    await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);

    res.json({
      message: "Playlist created successfully!",
      playlistUrl: playlist.body.external_urls.spotify, // Provide the URL to the playlist
    });
  } catch (error: any) {
    console.error("Error creating playlist:", error.message);
    res.status(500).json({ error: error.message }); // Return error if creating the playlist fails
  }
});

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({ error: err.message }); // Return error response to the client
});

// Start the server
export const initializeServerExpress = () => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`); // Log the server startup message
  });
};
