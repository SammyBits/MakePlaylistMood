import SpotifyWebApi from "spotify-web-api-node";

/**
 * Creates an instance of the `SpotifyWebApi` class using credentials from environment variables.
 * This instance is used to interact with Spotify's Web API to perform actions like authentication,
 * playlist management, and searching tracks.
 */
const spotifyApi = new SpotifyWebApi({
  /**
   * The Spotify client ID used to identify the application.
   * Retrieved from the environment variable `SPOTIFY_CLIENT_ID`.
   */
  clientId: process.env.SPOTIFY_CLIENT_ID,

  /**
   * The Spotify client secret used to authenticate the application.
   * Retrieved from the environment variable `SPOTIFY_CLIENT_SECRET`.
   */
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,

  /**
   * The redirect URI for the Spotify API callback after authentication.
   * Retrieved from the environment variable `SPOTIFY_REDIRECT_URI`.
   */
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

/**
 * Export the `spotifyApi` instance for use in other parts of the application.
 * This instance is pre-configured with authentication credentials to interact with the Spotify Web API.
 */
export default spotifyApi;
