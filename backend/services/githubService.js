const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';
const contextCache = {}; // Simple in-memory cache

/**
 * Fetch the full repository tree recursively using the GitHub Data API
 */
async function fetchRepoTree(owner, repo, branch = 'main') {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RepoLens-AI'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // 1. Get the latest commit SHA for the branch to get the tree SHA
    const branchRes = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/branches/${branch}`, { headers });
    const treeSha = branchRes.data.commit.sha;

    // 2. Get the full recursive tree
    const treeRes = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`, { headers });
    return treeRes.data.tree;
  } catch (error) {
    console.error('GitHub Tree API Error:', error.message);
    // Fallback or rethrow
    throw new Error(`Failed to fetch repo structure for ${owner}/${repo}`);
  }
}

/**
 * Fetch a snippet (first 1000 chars) from a raw file content
 */
async function fetchFileSnippet(owner, repo, path) {
  const headers = { 'User-Agent': 'RepoLens-AI' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
    const res = await axios.get(rawUrl, { headers, responseType: 'text' });
    return res.data.slice(0, 1000);
  } catch (error) {
    return `[Error fetching content for ${path}]`;
  }
}

/**
 * Build a concise context of the repository (Limit: ~15KB total)
 */
async function buildRepoContext(owner, repo) {
  const cacheKey = `${owner}/${repo}`;
  if (contextCache[cacheKey]) {
    console.log(`[Cache Hit] Serving context for ${cacheKey}`);
    return contextCache[cacheKey];
  }

  console.log(`[Cache Miss] Building context for ${cacheKey}...`);
  
  const tree = await fetchRepoTree(owner, repo);
  
  // 1. Prioritize critical files
  const priorityFiles = ['README.md', 'package.json'];
  const srcFiles = tree.filter(item => item.path.startsWith('src/') && item.type === 'blob');
  
  // 2. Select files to include
  const selectedFiles = tree.filter(item => {
    if (item.type !== 'blob') return false;
    const path = item.path;
    
    // Explicit priority
    if (priorityFiles.includes(path)) return true;
    
    // Source files only
    if (!path.startsWith('src/')) return false;

    // Filter by extension
    const importantExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md'];
    return importantExtensions.some(ext => path.endsWith(ext));
  }).slice(0, 30); // Max 30 files for deep context

  let context = `Repository: ${owner}/${repo}\n\n`;
  const MAX_CONTEXT_CHARS = 15000; // ~15KB limit
  
  for (const file of selectedFiles) {
    if (context.length > MAX_CONTEXT_CHARS) {
      console.warn(`[Truncation] Context limit reached for ${owner}/${repo}`);
      break;
    }
    
    const snippet = await fetchFileSnippet(owner, repo, file.path);
    const fileBlock = `FILE: ${file.path}\nCONTENT:\n${snippet}\n--------------------------------\n\n`;
    
    // Ensure we don't exceed the limit with this block
    if ((context.length + fileBlock.length) > MAX_CONTEXT_CHARS) {
      context += `[... further files truncated to save context window ...]\n`;
      break;
    }
    
    context += fileBlock;
  }

  contextCache[cacheKey] = context;
  return context;
}

/**
 * Fetch full file content from GitHub raw
 */
async function fetchFileContent(owner, repo, path) {
  const headers = { 'User-Agent': 'RepoLens-AI' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
    const res = await axios.get(rawUrl, { headers, responseType: 'text' });
    return res.data;
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error.message);
    throw new Error(`Could not fetch file content for ${path}`);
  }
}

module.exports = {
  buildRepoContext,
  fetchFileContent
};
