import model from "../../configs/GeminiSettings";

/**
 * Extracts specific keywords (Artist, Mood, and Genre) from a given text prompt.
 * The function uses a generative AI model to process the prompt and extract the relevant information.
 * 
 * @param {string} prompt - The text input from which to extract keywords.
 * This prompt should describe the music or content you want to extract keywords from (e.g., artist names, moods, genres).
 * 
 * @returns {Promise<string[]>} A promise that resolves to an array of extracted keywords (Artist, Mood, Genre).
 * Each keyword is represented as a string.
 * 
 * @example
 * const keywords = await extractKeywords("A happy song by The Beatles in the rock genre");
 * console.log(keywords); // ['The Beatles', 'happy', 'rock']
 */
export const extractKeywords = async (prompt: string): Promise<string[]> => {
  try {
    console.log("User prompt:", prompt);

    // Use the AI model to process the prompt and extract keywords.
    const result = await model.generateContent(
      `You are a professional assistant capable of extracting only essential information from a text. From the following text, extract the Artist, Mood, and Genre. Provide the response only as comma-separated values (no introduction, no additional text, just keywords).
      
      Text to extract from: ${prompt}`
    );

    const keywordsText = result.response.text();

    if (!keywordsText) {
      console.log("No keywords extracted.");
      return [];
    }

    console.log("Keywords extracted:", keywordsText);

    // Process the extracted text to clean and format the keywords.
    const cleanedKeywords = keywordsText
      .split("\n") // Split the response text into separate lines.
      .filter((line) => line.trim() !== "") // Remove empty lines.
      .map((line) => line.trim()) // Trim spaces from each line.
      .map((line) => {
        // Remove labels like "Artist:", "Mood:", "Genre:" and unnecessary characters.
        return line.replace(/(Artist:|Mood:|Genre:)\s*/i, "").trim();
      })
      .map((line) => {
        // Remove unwanted characters (e.g., asterisks).
        return line.replace(/[*]/g, "").trim();
      })
      .filter(
        (line) =>
          !line.startsWith("Here are the extracted details:") &&
          !line.startsWith("-")
      ); // Filter out non-relevant text

    console.log("Cleaned Keywords:", cleanedKeywords);

    return cleanedKeywords;
  } catch (error: any) {
    console.error("Error extracting keywords:", error.message);
    return [];
  }
};
