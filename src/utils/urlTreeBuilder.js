export const buildTree = (urls) => {
  const tree = {};
  urls.forEach(url => {
    const parts = url.replace('https://', '').split('/');
    let current = tree;
    parts.forEach(part => {
      if (!current[part]) current[part] = {};
      current = current[part];
    });
    current.url = url; // Nodo hoja
  });
  return tree;
};


export const transformToPrimeTree = (node, parentKey = '') => {
  return Object.entries(node).filter(([k]) => k !== 'url').map(([key, value]) => {
    const currentKey = value.url || `${parentKey}/${key}`;
    const childKeys = Object.keys(value).filter(k => k !== 'url');
    const hasChildren = typeof value === 'object' && childKeys.length > 0;

    return {
      key: currentKey,
      label: key,
      ...(hasChildren && {
        children: transformToPrimeTree(value, currentKey)
      }),
      ...(value.url && {
        data: { url: value.url }
      })
    };
  });
};