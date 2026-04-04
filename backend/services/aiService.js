const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const aiResponseCache = {};

/**
 * Generate AI Response with 3 retries for 429 errors
 */
const generateAIResponse = async (context, question, repoKey) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in the backend .env file.");
  }

  // 1. Check response cache
  const cacheKey = `${repoKey}-${question}`;
  if (aiResponseCache[cacheKey]) {
    console.log(`[AI Cache Hit] for: ${cacheKey}`);
    return aiResponseCache[cacheKey];
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `
You are an expert software engineer analyzing a GitHub repository.

REPOSITORY CONTEXT:
${context}

USER QUESTION:
${question}

INSTRUCTIONS:
1. Answer ONLY based on the repository context above.
2. Mention specific file names when relevant.
3. If the information is not available in the context, say: "Not enough information from the repository."
4. Be concise and structured.
5. Use bullet points where appropriate.

ANSWER:
`;

  let lastError;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      if (i > 0) console.log(`[Retry ${i}] for Gemini API...`);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Cache successful response
      aiResponseCache[cacheKey] = text;
      return text;
    } catch (error) {
      lastError = error;
      // Only retry on 429
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = (i + 1) * 2000;
        console.warn(`[GEMINI 429] Reached limit. Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

module.exports = { generateAIResponse };
