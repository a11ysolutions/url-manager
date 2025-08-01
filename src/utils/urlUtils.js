import { TREE_NODE_TYPES } from '../constants';

export const parseUrlComponents = (url) => {
  if (!url || typeof url !== 'string') return null;

  try {
    const cleanUrl = url.replace('https://', '');
    const [application, client, template, siteEdition, ...rest] = cleanUrl.split('/');

    return {
      application: application || '',
      client: client || '',
      template: template || '',
      siteEdition: siteEdition || '',
      fullPath: cleanUrl,
      hasExtraPath: rest.length > 0
    };
  } catch (error) {
    console.warn('Error parsing URL:', url, error);
    return null;
  }
};

export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const createApplicationNode = (app, appKey) => ({
  key: appKey,
  label: app,
  children: [],
  data: { type: TREE_NODE_TYPES.APPLICATION, value: app }
});

export const createClientNode = (client, clientKey) => ({
  key: clientKey,
  label: client,
  children: [],
  data: { type: TREE_NODE_TYPES.CLIENT, value: client }
});

export const createTemplateNode = (template, templateKey) => ({
  key: templateKey,
  label: template,
  children: [],
  data: { type: TREE_NODE_TYPES.TEMPLATE, value: template }
});

export const createEditionNode = (edition, editionKey) => ({
  key: editionKey,
  label: edition,
  children: [],
  data: { type: TREE_NODE_TYPES.SITE_EDITION, value: edition }
});

export const createUrlNode = (url) => ({
  key: url,
  label: url,
  icon: 'pi pi-link',
  data: { type: TREE_NODE_TYPES.URL, value: url }
});

export const convertToTreeNodes = (treeData) => {
  if (!treeData || typeof treeData !== 'object') return [];
  
  const nodes = [];
  
  Object.keys(treeData).forEach(app => {
    const appKey = `app-${app}`;
    const appNode = createApplicationNode(app, appKey);
    
    Object.keys(treeData[app]).forEach(client => {
      const clientKey = `${appKey}-client-${client}`;
      const clientNode = createClientNode(client, clientKey);
      
      Object.keys(treeData[app][client]).forEach(template => {
        const templateKey = `${clientKey}-template-${template}`;
        const templateNode = createTemplateNode(template, templateKey);
        
        Object.keys(treeData[app][client][template]).forEach(edition => {
          const editionKey = `${templateKey}-edition-${edition}`;
          const editionNode = createEditionNode(edition, editionKey);
          
          treeData[app][client][template][edition].forEach(url => {
            editionNode.children.push(createUrlNode(url));
          });
          
          templateNode.children.push(editionNode);
        });
        
        clientNode.children.push(templateNode);
      });
      
      appNode.children.push(clientNode);
    });
    
    nodes.push(appNode);
  });
  
  return nodes;
};

export const parseUrlsToTree = (urls) => {
  if (!Array.isArray(urls) || urls.length === 0) return {};
  
  const tree = {};
  
  urls.forEach(url => {
    if (!validateUrl(url)) {
      console.warn('Invalid URL skipped:', url);
      return;
    }
    
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
      
      const componentValue = components[key];
      return Array.isArray(selected) 
        ? selected.includes(componentValue)
        : selected === componentValue;
    });
  });
};