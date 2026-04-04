import React, { createContext, useContext, useState, useEffect } from 'react';

const RepoContext = createContext();

export function RepoProvider({ children }) {
  // Synchronous initialization to avoid null-flicker and initial render crashes
  const [analysis, setAnalysis] = useState(() => {
    const savedAnalysis = sessionStorage.getItem('repo_analysis');
    return savedAnalysis ? JSON.parse(savedAnalysis) : null;
  });
  
  const [repoInfo, setRepoInfo] = useState(() => {
    const savedRepoInfo = sessionStorage.getItem('repo_info');
    return savedRepoInfo ? JSON.parse(savedRepoInfo) : null;
  });

  const setRepoData = (newAnalysis, newRepoInfo) => {
    setAnalysis(newAnalysis);
    setRepoInfo(newRepoInfo);
    
    // Persist to session storage so refresh works during demo
    if (newAnalysis) sessionStorage.setItem('repo_analysis', JSON.stringify(newAnalysis));
    if (newRepoInfo) sessionStorage.setItem('repo_info', JSON.stringify(newRepoInfo));
  };

  const clearRepoData = () => {
    setAnalysis(null);
    setRepoInfo(null);
    sessionStorage.removeItem('repo_analysis');
    sessionStorage.removeItem('repo_info');
  };

  return (
    <RepoContext.Provider value={{ analysis, repoInfo, setRepoData, clearRepoData }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error('useRepo must be used within a RepoProvider');
  }
  return context;
}
