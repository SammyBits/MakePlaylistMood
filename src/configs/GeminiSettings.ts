/**
 * Import the GoogleGenerativeAI class from the `@google/generative-ai` package.
 * This class allows interaction with Google's generative AI models.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Creates an instance of the GoogleGenerativeAI class using the API key from the environment variables.
 * This instance is used to interact with the Gemini AI model for generative tasks.
 *
 * @example
 * const geminiAi = new GoogleGenerativeAI('your-api-key');
 */
export const geminiAi = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

/**
 * Retrieves a specific generative model (gemini-1.5-flash) using the geminiAi instance.
 * The model can then be used to generate AI-driven content based on the selected model.
 *
 * @param {Object} options - The configuration options for selecting the generative model.
 * @param {string} options.model - The name of the AI model to use (e.g., 'gemini-1.5-flash').
 * 
 * @returns {GenerativeModel} The generative model instance configured for use.
 *
 * @example
 * const model = geminiAi.getGenerativeModel({ model: "gemini-1.5-flash" });
 */
const model = geminiAi.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Exports the selected generative model for use in other parts of the application.
 * This default export can be imported wherever the generative model is needed.
 */
export default model;
