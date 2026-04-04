const { generateAIResponse } = require("../services/aiService");

const handleAIChat = async (req, res) => {
  try {
    const { question, repoData } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Missing or invalid question"
      });
    }

    if (!repoData) {
      return res.status(400).json({
        error: "Missing repo metadata (repoData) for context"
      });
    }

    const answer = await generateAIResponse(repoData, question);

    return res.json({ answer });
  } catch (error) {
    // Return safe message without exposing internal errors as specified in Step 11
    return res.status(500).json({
      error: "AI failed. Try again."
    });
  }
};

module.exports = {
  handleAIChat,
};
