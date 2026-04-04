const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateAIResponse = async (repoData, question) => {
  try {
    const safeStructure = repoData.structure ? JSON.stringify(repoData.structure).slice(0, 3000) : "[]";
    const safeFiles = repoData.files ? JSON.stringify(repoData.files).slice(0, 3000) : "[]";
    
    // Add logging as requested in Step 9
    console.log("[AI Query] Question:", question);

    const prompt = `
You are an expert software engineer.

Repository Summary:
${repoData.summary || "No summary provided"}

Folder Structure:
${safeStructure}

Files:
${safeFiles}

Answer clearly and concisely:
${question}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Replaced hallucinations with actual lightweight model
      messages: [
        { role: "system", content: "You are a helpful codebase assistant. Keep your responses clear, concise, and related directly to the codebase provided." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("[AI ERROR]:", error.message);
    throw new Error("AI response failed");
  }
};

module.exports = {
  generateAIResponse,
};
