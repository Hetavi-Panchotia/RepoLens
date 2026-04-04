const { buildRepoContext } = require("../services/githubService");
const { generateAIResponse } = require("../services/aiService");

const handleAIChat = async (req, res) => {
  let owner, repo; // Declare in outer scope for error logging
  try {
    const { message, owner: _owner, repo: _repo } = req.body;
    owner = _owner;
    repo = _repo;

    if (!message || !owner || !repo) {
      return res.status(400).json({
        error: "Missing message, owner, or repo in request"
      });
    }

    // 1. Build or fetch repository context
    const context = await buildRepoContext(owner, repo);

    // AI UX Trick: Artificial delay for smoother feeling
    await new Promise(resolve => setTimeout(resolve, 800));

    // 2. Generate AI response based on the context
    const answer = await generateAIResponse(context, message, `${owner}/${repo}`);

    return res.json({ answer });
  } catch (error) {
    if (error.status === 429) {
      console.warn(`[RATE LIMIT] Gemini API limit hit. Wait 60s.`);
    } else if (error.status === 401 || error.status === 403) {
      console.error(`[AUTH ERROR] Gemini API Key is invalid or expired. Check your .env!`);
    }
    
    const repoLabel = (owner && repo) ? `${owner}/${repo}` : 'unknown repo';
    console.error(`AI CONTROLLER ERROR [${repoLabel}]:`, error.message);
    
    return res.status(error.status || 500).json({
      error: error.status === 429 
        ? "AI is temporarily busy (Rate Limit). Please wait a minute." 
        : error.status === 401 || error.status === 403
        ? "AI Authentication failed. Check Server config."
        : "AI failed. Try again."
    });
  }
};

module.exports = {
  handleAIChat,
};
