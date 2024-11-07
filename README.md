# MakePlaylistMood

+ This is a backend application that integrates with Spotify API to create personalized playlists based on user input, leveraging both AI and database technologies like SQLite and Redis.

## Table of Contents

+ [Installation](#installation)
+ [Environment Variables](#environment-variables)
+ [Endpoints](#endpoints)
+ [Running the Application](#running-the-application)
+ [Technologies](#technologies)

## Installation

+ To get started with the project, follow these steps to install and set up the application:

1. Clone the repository:

    ```bash
    git clone https://github.com/SammyBits/MakePlaylistMood
    ```

2. Navigate into the project directory:

    ```bash
    cd MakePlaylistMood
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Environment Variables

+ Before running the application, make sure to set up the environment variables. These are required for connecting to third-party services like Spotify, Redis, and SQLite.

+ Create a `.env` file in the root of the project and add the following keys:

    ```bash
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    SPOTIFY_REDIRECT_URI=your_spotify_redirect_uri
    REDIS_HOST=your_redis_host
    REDIS_PASSWORD=your_redis_password
    GEMINI_API_KEY=your_gemini_api_key
    NODE_ENV=development
    ```

+ You can specify `.env.development` or `.env.production` depending on your environment (development or production).

## Endpoints

+ Here are the available API endpoints in the application:

### 1. **`GET /api/v1/login`**

+ Redirects the user to the Spotify authorization page for login.

### 2. **`GET /api/v1/callback`**

+ Callback endpoint for handling Spotify authentication after login.

+ This endpoint receives the authorization code and exchanges it for access and refresh tokens. Tokens are then stored in Redis and SQLite.

### 3. **`GET /api/v1/refresh`**

+ Refreshes the access token using the stored refresh token.

+ This endpoint will retrieve the refresh token from SQLite and use it to refresh the access token in Redis.

### 4. **`POST /api/v1/create-playlist`**

+ Creates a Spotify playlist based on a user-provided prompt.

+ The prompt is processed to extract keywords (like Artist, Mood, Genre) using Gemini AI. These keywords are then used to search for matching tracks on Spotify. A playlist is created, and the tracks are added.

## Running the Application

+ To run the application locally, make sure the environment variables are set up correctly and then run the following command:

    ```bash
    npm run dev
    ```

+ The server will start, and you can access it at `http://localhost:3000`.

+ If you're using a different port, it can be set with the `EXPRESS_PORT` environment variable.

## Technologies

+ The project uses the following technologies:

+ **Node.js** for the server-side JavaScript runtime.
+ **Express** for creating the HTTP API.
+ **Spotify Web API** for interacting with Spotify's music and playlists features.
+ **Redis** for caching access tokens to optimize the API requests.
+ **SQLite** for storing refresh tokens securely.
+ **Gemini AI** for extracting keywords from text prompts to generate playlists.
+ **dotenv** for loading environment variables.
+ **morgan** for logging HTTP requests during development.

## How it Works

+ The application follows a few main steps to process requests:

### 1. **Spotify Authentication**

+ The user is redirected to Spotify for login (`/api/v1/login`), and after successful login, a callback (`/api/v1/callback`) exchanges the authorization code for an access token and refresh token.

+ The access token is cached in Redis, while the refresh token is saved in SQLite.

### 2. **Token Refresh**

+ The `/api/v1/refresh` endpoint retrieves the stored refresh token and uses it to refresh the access token.

### 3. **Playlist Creation**

+ When the user provides a prompt through `/api/v1/create-playlist`, the application uses Gemini AI to extract relevant keywords (Artist, Mood, Genre).

+ These keywords are used to search for tracks on Spotify. A new playlist is created, and the tracks are added to it.

## Example

+ Example of how the application works:

1. **Login**: The user visits `/api/v1/login` and is redirected to Spotify to log in.

2. **Callback**: After logging in, Spotify redirects the user to `/api/v1/callback` with an authorization code. The code is exchanged for tokens, and the user is authenticated.

3. **Create Playlist**: The user provides a text prompt (e.g., "Create a playlist with upbeat pop songs"). The AI extracts keywords like "upbeat" and "pop," searches for tracks on Spotify, and creates a new playlist.

## Troubleshooting

+ **Token Issues**: If you encounter errors related to tokens, ensure that the refresh token is correctly stored in the SQLite database and that Redis is properly configured.

+ **Environment Variables**: Double-check that your `.env` file is correctly set up with valid API keys and Redis settings.

+ **Spotify Limits**: Be mindful of the Spotify API rate limits. If the application makes too many requests in a short period, Spotify might block the requests temporarily.

## License

+ This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
