const { fetchFileContent } = require("../services/githubService");

const getFileContent = async (req, res) => {
  try {
    const { owner, repo, path } = req.query;

    if (!owner || !repo || !path) {
      return res.status(400).json({ error: "Missing owner, repo, or path" });
    }

    const content = await fetchFileContent(owner, repo, path);
    res.json({ content });
  } catch (error) {
    console.error('File Controller Error:', error.message);
    res.status(500).json({ error: "Failed to fetch file content" });
  }
};

module.exports = {
  getFileContent
};
