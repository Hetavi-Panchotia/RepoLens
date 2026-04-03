const express = require('express');
const axios = require('axios');
const OpenAI = require('openai');
const router = express.Router();

const openai = new OpenAI();

router.post('/', async (req, res, next) => {
  try {
    const { repoUrl, owner, repo } = req.body;

    // Proper error handling for missing inputs
    if (!repoUrl || !owner || !repo) {
      return res.status(400).json({ 
        error: 'Missing required fields: repoUrl, owner, repo' 
      });
    }

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      // We will add User-Agent because GitHub API requires it
      'User-Agent': 'RepoLens-Backend'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
      // 1. Fetch overall Repo Info
      const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      const repoInfo = {
        name: repoRes.data.name,
        description: repoRes.data.description,
        stars: repoRes.data.stargazers_count,
        language: repoRes.data.language,
      };

      // 2. Fetch Top-Level File List
      const contentsRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers });
      
      // Ensure we only process if it's an array (sometimes it's a single file if repo is tiny)
      let fileList = [];
      if (Array.isArray(contentsRes.data)) {
        fileList = contentsRes.data.map(item => ({
          name: item.name,
          path: item.path,
          type: item.type, // 'file' or 'dir'
        }));
      }

      // 3. Fetch Readme
      let readmeContent = '';
      try {
        const readmeRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: {
            ...headers,
            'Accept': 'application/vnd.github.v3.raw'
          }
        });
        readmeContent = readmeRes.data;
      } catch (readmeErr) {
        // Readme might not exist, simply leave it empty
        if (readmeErr.response?.status !== 404) {
          console.warn('Failed to fetch readme:', readmeErr.message);
        }
      }

      const trimmedReadme = typeof readmeContent === 'string' ? readmeContent.slice(0, 8000) : '';
      
      // 4. Generate AI Analysis
      const prompt = `
Explain this repository like onboarding a developer. Provide a summary and explain each top-level folder.

Repository Name: ${repoInfo.name}
Description: ${repoInfo.description || 'No description provided'}
Language: ${repoInfo.language || 'Unknown'}

Top-level files and folders:
${fileList.map(f => `- ${f.name} (${f.type})`).join('\n')}

README Context:
${trimmedReadme}
`;

      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert senior developer helping a new engineer onboard. Output valid JSON structured exactly like this:
{
  "summary": "Plain-English overview of what this project does and how it works.",
  "folders": [
    { "name": "folder_or_file_name", "explanation": "Brief explanation of its purpose" }
  ]
}`
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const aiResult = JSON.parse(aiResponse.choices[0].message.content);

      // Return the final data
      return res.status(200).json({
        summary: aiResult.summary,
        folders: aiResult.folders,
        repoInfo, // Returning raw data too, in case frontend wants it
      });

    } catch (githubErr) {
      // Handle GitHub API errors gracefully
      if (githubErr.response) {
        if (githubErr.response.status === 404) {
          return res.status(404).json({ error: 'Repository not found. Ensure it is public and spelled correctly.' });
        }
        if (githubErr.response.status === 403 || githubErr.response.status === 429) {
          return res.status(429).json({ error: 'GitHub API rate limit exceeded. Please try again later.' });
        }
      }
      throw githubErr; // Fall down to the outer catch if it's an unknown error
    }

  } catch (error) {
    next(error);
  }
});

module.exports = router;
