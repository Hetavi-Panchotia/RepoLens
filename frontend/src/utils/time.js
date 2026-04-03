/**
 * Minimal time utility — avoids adding date-fns as a dependency.
 * Returns a human-readable relative time string.
 */
export function formatDistanceToNow(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffS = Math.floor(diffMs / 1000);
  const diffM = Math.floor(diffS / 60);
  const diffH = Math.floor(diffM / 60);

  if (diffS < 60) return 'just now';
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  return 'a while ago';
}
