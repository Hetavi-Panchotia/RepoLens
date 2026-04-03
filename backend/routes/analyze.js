const express = require('express');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { repoUrl, owner, repo } = req.body;

    // Proper error handling for missing inputs
    if (!repoUrl || !owner || !repo) {
      return res.status(400).json({ 
        error: 'Missing required fields: repoUrl, owner, repo' 
      });
    }

    // Return the mock response exactly as requested
    return res.status(200).json({
      summary: "Sample project",
      structure: []
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
