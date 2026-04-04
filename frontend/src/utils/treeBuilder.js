/**
 * Builds a nested tree structure from a flat list of GitHub tree items.
 */
export function buildFileTree(flatTree) {
  const root = { name: 'root', type: 'tree', children: {} };
  
  if (!flatTree || !Array.isArray(flatTree)) return root;

  flatTree.forEach(item => {
    const parts = item.path.split('/');
    let current = root;
    
    parts.forEach((part, index) => {
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          type: (index === parts.length - 1) ? item.type : 'tree',
          children: (index === parts.length - 1 && item.type === 'blob') ? null : {}
        };
      }
      current = current.children[part];
    });
  });

  return root;
}
