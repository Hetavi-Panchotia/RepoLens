const express = require('express');
const axios = require('axios');
const supabase = require('../utils/supabase');
const router = express.Router();

/**
 * Helper to extract owner and repo name from a GitHub URL
 */
function extractGitHubInfo(url) {
  try {
    const trimmed = url.trim().replace(/\/$/, ""); // Remove trailing slash
    const match = trimmed.match(/^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)$/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  } catch (e) {
    return null;
  }
}

/**
 * Rule-based folder explanation logic
 */
const FOLDER_MAP = {
  "src": "Main source code of the project",
  "components": "Reusable UI components",
  "backend": "Server-side logic and APIs",
  "utils": "Helper functions and utilities",
  "public": "Static assets",
  "services": "Business logic and external API integrations",
  "hooks": "Custom React hooks",
  "assets": "Images, fonts, and other static files",
  "config": "Configuration files and environment setup",
  "tests": "Unit, integration, and E2E tests",
  "docs": "Documentation and guides",
  "styles": "Global styles and CSS modules",
};

function getFolderExplanation(name) {
  const lowerName = name.toLowerCase();
  return FOLDER_MAP[lowerName] || "General project directory";
}

router.post('/', async (req, res, next) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: 'Missing required field: repoUrl' });
    }

    const info = extractGitHubInfo(repoUrl);
    if (!info) {
      return res.status(400).json({ error: 'Invalid GitHub URL. Format: https://github.com/owner/repo' });
    }

    const { owner, repo } = info;

    // 1. Check Supabase Cache
    if (supabase) {
      console.log(`Checking cache for: ${repoUrl}`);
      const { data: cachedRepo, error: cacheError } = await supabase
        .from('repositories')
        .select('summary, structure, repo_meta')
        .eq('repo_url', repoUrl)
        .single();

      if (cachedRepo) {
        console.log('Cache hit! Returning stored data.');
        return res.status(200).json({
          summary: cachedRepo.summary,
          folders: cachedRepo.structure.folders,
          files: cachedRepo.structure.files,
          repoInfo: cachedRepo.repo_meta
        });
      }

      if (cacheError && cacheError.code !== 'PGRST116') {
        console.error('Supabase error checking cache:', cacheError.message);
      }
    } else {
      console.log('Supabase client not initialized. Skipping cache check.');
    }

    // 2. Fetch from GitHub API
    console.log(`Fetching from GitHub: ${owner}/${repo}`);
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'RepoLens-Backend'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    let contents, repoMeta;
    try {
      // 2a. Fetch Repo Metadata (stars, description, etc.)
      const metaRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      repoMeta = {
        owner: metaRes.data.owner.login,
        repo: metaRes.data.name,
        description: metaRes.data.description,
        stars: metaRes.data.stargazers_count,
        forks: metaRes.data.forks_count,
        language: metaRes.data.language,
        topics: metaRes.data.topics || [],
        url: metaRes.data.html_url,
        lastUpdated: new Date(metaRes.data.updated_at).toLocaleDateString()
      };

      // 2b. Fetch Contents
      const contentsRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers });
      contents = contentsRes.data;
    } catch (githubErr) {
      console.error('GitHub API error:', githubErr.message);
      if (githubErr.response?.status === 404) {
        return res.status(404).json({ error: 'Repository not found or is private' });
      }
      return res.status(githubErr.response?.status || 500).json({ error: 'Failed to fetch repository from GitHub' });
    }

    // 3. Process Data (No AI)
    const folders = contents
      .filter(item => item.type === 'dir')
      .map(dir => ({
        name: dir.name,
        explanation: getFolderExplanation(dir.name)
      }));

    const files = contents
      .filter(item => item.type === 'file')
      .map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      }));

    const summary = `This repository contains ${folders.length} folders and ${files.length} files at the top level. PRIMARY LANGUAGE: ${repoMeta.language || 'Unknown'}. DESCRIPTION: ${repoMeta.description || 'No description'}.`;

    // 4. Save to Database
    if (supabase) {
      console.log('Saving to database...');
      const { error: insertError } = await supabase
        .from('repositories')
        .insert([
          { 
            repo_url: repoUrl, 
            summary: summary, 
            structure: { folders, files }, 
            repo_meta: repoMeta 
          }
        ]);

      if (insertError) {
        console.error('Supabase error saving repo:', insertError.message);
      }
    } else {
      console.log('Supabase client not initialized. Skipping database save.');
    }

    // 5. Return Response
    return res.status(200).json({
      summary,
      folders,
      files,
      repoInfo: repoMeta
    });

  } catch (error) {
    console.error('Unexpected error:', error.message);
    res.status(500).json({ error: 'Failed to analyze repository' });
  }
});

module.exports = router;


module.exports = router;
