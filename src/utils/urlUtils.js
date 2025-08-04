import { TREE_NODE_TYPES } from '../constants';

export const parseUrlComponents = (url) => {
  if (!url || typeof url !== 'string') return null;

  const cleanUrl = url.replace('https://', '');
  const [application, client, template, siteEdition] = cleanUrl.split('/');

  return { application, client, template, siteEdition };
};

export const parseUrlsToTree = (urls) => {
  if (!Array.isArray(urls) || urls.length === 0) return {};
  
  const tree = {};
  
  urls.forEach(url => {
    const components = parseUrlComponents(url);
    if (!components) return;
    
    const { application, client, template, siteEdition } = components;
    
    if (!tree[application]) tree[application] = {};
    if (!tree[application][client]) tree[application][client] = {};
    if (!tree[application][client][template]) tree[application][client][template] = {};
    if (!tree[application][client][template][siteEdition]) {
      tree[application][client][template][siteEdition] = [];
    }
    
    tree[application][client][template][siteEdition].push(url);
  });
  
  return tree;
};

export const convertToTreeNodes = (treeData) => {
  if (!treeData || typeof treeData !== 'object') return [];
  
  return Object.entries(treeData).map(([app, clients]) => {
    const appKey = `app-${app}`;
    return {
      key: appKey,
      label: app,
      data: { type: TREE_NODE_TYPES.APPLICATION, value: app },
      children: Object.entries(clients).map(([client, templates]) => {
        const clientKey = `${appKey}-client-${client}`;
        return {
          key: clientKey,
          label: client,
          data: { type: TREE_NODE_TYPES.CLIENT, value: client },
          children: Object.entries(templates).map(([template, editions]) => {
            const templateKey = `${clientKey}-template-${template}`;
            return {
              key: templateKey,
              label: template,
              data: { type: TREE_NODE_TYPES.TEMPLATE, value: template },
              children: Object.entries(editions).map(([edition, urls]) => {
                const editionKey = `${templateKey}-edition-${edition}`;
                return {
                  key: editionKey,
                  label: edition,
                  data: { type: TREE_NODE_TYPES.SITE_EDITION, value: edition },
                  children: urls.map(url => ({
                    key: url,
                    label: url,
                    icon: 'pi pi-link',
                    data: { type: TREE_NODE_TYPES.URL, value: url }
                  }))
                };
              })
            };
          })
        };
      })
    };
  });
};

export const extractSelectedUrls = (selectedKeys, nodes) => {
  if (!selectedKeys || !nodes) return [];

  const result = [];
  const traverse = (nodeList) => {
    nodeList.forEach(node => {
      if (selectedKeys[node.key] && node.data?.type === TREE_NODE_TYPES.URL) {
        result.push(node.data.value);
      }
      if (node.children) traverse(node.children);
    });
  };
  traverse(nodes);
  return result;
};

export const filterUrls = (urls, filters) => {
  if (!Array.isArray(urls) || !filters) return urls;
  
  return urls.filter(url => {
    const components = parseUrlComponents(url);
    if (!components) return false;
    
    return Object.entries(filters).every(([key, selected]) => {
      if (!selected || (Array.isArray(selected) && selected.length === 0)) return true;
      return selected.includes(components[key]);
    });
  });
};