/**
 * Utilidades para parsear URLs en estructura de árbol
 */

/**
 * Parsea una URL en sus componentes
 * @param {string} url - URL completa (ej: "https://dashboard/acme/blog/dev")
 * @returns {object} - Objeto con componentes parseados
 */
export const parseUrl = (url) => {
  try {
    // Validar que la URL tenga el formato correcto
    if (!url || typeof url !== 'string') {
      console.warn('URL inválida:', url);
      return null;
    }
    
    // Crear objeto URL para parsear correctamente
    const urlObj = new URL(url);
    
    // Obtener las partes del path (sin barras vacías)
    let pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
    
    // Si el hostname no es un dominio real (como dashboard, portal), 
    // entonces es parte del path
    if (urlObj.hostname && !urlObj.hostname.includes('.') && urlObj.hostname !== 'localhost') {
      // Agregar el hostname como primera parte del path
      pathParts = [urlObj.hostname, ...pathParts];
    }
    
    // Validar que tengamos al menos 2 partes (application y client)
    if (pathParts.length < 2) {
      console.warn('URL con formato insuficiente:', url);
      return null;
    }
    
    return {
      application: pathParts[0] || '', // Primera parte: dashboard
      client: pathParts[1] || '',      // Segunda parte: acme
      template: pathParts[2] || '',    // Tercera parte: blog
      siteEdition: pathParts[3] || '', // Cuarta parte: dev
      fullUrl: url                     // URL completa
    };
  } catch (error) {
    console.error('Error parsing URL:', url, error);
    return null;
  }
};

/**
 * Convierte una lista de URLs en estructura de árbol para PrimeReact
 * @param {string[]} urls - Array de URLs
 * @returns {array} - Array de nodos del árbol
 */
export const buildTreeFromUrls = (urls) => {
  const tree = {};
  
  // Parsear todas las URLs
  urls.forEach(url => {
    const parsed = parseUrl(url);
    if (!parsed) return; // Saltar URLs inválidas
    
    const { application, client, template, siteEdition, fullUrl } = parsed;
    
    // Crear estructura jerárquica nivel por nivel
    
    // Nivel 1: Application (dashboard, portal, etc.)
    if (!tree[application]) {
      tree[application] = {
        key: application,
        label: application,
        data: application,
        children: {}
      };
    }
    
    // Nivel 2: Client (acme, globex, etc.)
    if (!tree[application].children[client]) {
      tree[application].children[client] = {
        key: `${application}-${client}`,
        label: client,
        data: client,
        children: {}
      };
    }
    
    // Nivel 3: Template (blog, news, shop, etc.)
    if (!tree[application].children[client].children[template]) {
      tree[application].children[client].children[template] = {
        key: `${application}-${client}-${template}`,
        label: template,
        data: template,
        children: {}
      };
    }
    
    // Nivel 4: Site Edition (dev, prod, v1, v2, staging, etc.)
    // Solo crear si siteEdition no está vacío
    if (siteEdition) {
      if (!tree[application].children[client].children[template].children[siteEdition]) {
        tree[application].children[client].children[template].children[siteEdition] = {
          key: `${application}-${client}-${template}-${siteEdition}`,
          label: siteEdition,
          data: siteEdition,
          children: {}
        };
      }
      
      // Nivel 5: URL completa (nodo hoja)
      tree[application].children[client].children[template].children[siteEdition].children[fullUrl] = {
        key: fullUrl,
        label: fullUrl,
        data: fullUrl,
        leaf: true // Marcar como nodo hoja
      };
    } else {
      // Si no hay siteEdition, poner la URL directamente bajo template
      tree[application].children[client].children[template].children[fullUrl] = {
        key: fullUrl,
        label: fullUrl,
        data: fullUrl,
        leaf: true // Marcar como nodo hoja
      };
    }
  });
  
  // Convertir el objeto tree en array para PrimeReact
  return convertTreeToArray(tree);
};

/**
 * Convierte el objeto tree en array para PrimeReact
 * @param {object} tree - Objeto tree
 * @returns {array} - Array de nodos
 */
const convertTreeToArray = (tree) => {
  const result = [];
  
  // Convertir cada aplicación
  Object.values(tree).forEach(application => {
    const appNode = {
      key: application.key,
      label: application.label,
      data: application.data,
      children: []
    };
    
    // Convertir cada cliente
    Object.values(application.children).forEach(client => {
      const clientNode = {
        key: client.key,
        label: client.label,
        data: client.data,
        children: []
      };
      
      // Convertir cada template
      Object.values(client.children).forEach(template => {
        const templateNode = {
          key: template.key,
          label: template.label,
          data: template.data,
          children: []
        };
        
        // Convertir cada site edition o URL directa
        Object.values(template.children).forEach(item => {
          if (item.leaf) {
            // Es una URL directa (sin siteEdition)
            templateNode.children.push(item);
          } else {
            // Es un siteEdition
            const siteEditionNode = {
              key: item.key,
              label: item.label,
              data: item.data,
              children: []
            };
            
            // Convertir cada URL (nodo hoja)
            Object.values(item.children).forEach(url => {
              siteEditionNode.children.push(url);
            });
            
            templateNode.children.push(siteEditionNode);
          }
        });
        
        clientNode.children.push(templateNode);
      });
      
      appNode.children.push(clientNode);
    });
    
    result.push(appNode);
  });
  
  return result;
};

/**
 * Obtiene todas las URLs hijas de un nodo
 * @param {object} node - Nodo del árbol
 * @returns {array} - Array de URLs completas
 */
export const getChildUrls = (node) => {
  const urls = [];
  
  // Función recursiva para recorrer el árbol
  const traverse = (n) => {
    if (n.leaf) {
      // Si es un nodo hoja, agregar la URL
      urls.push(n.data);
    } else if (n.children) {
      // Si tiene hijos, recorrer cada uno
      n.children.forEach(child => traverse(child));
    }
  };
  
  traverse(node);
  return urls;
};

/**
 * Filtra el árbol según los filtros aplicados
 * @param {array} tree - Árbol completo
 * @param {object} filters - Objeto con filtros {applications, clients, templates, siteEditions}
 * @returns {array} - Árbol filtrado
 */
export const filterTree = (tree, filters) => {
  if (!filters || Object.keys(filters).every(key => !filters[key] || filters[key].length === 0)) {
    return tree;
  }
  
  return tree.filter(app => {
    // Filtrar por aplicación
    if (filters.applications && filters.applications.length > 0 && !filters.applications.includes(app.data)) {
      return false;
    }
    
    // Filtrar hijos
    if (app.children) {
      app.children = app.children.filter(client => {
        if (filters.clients && filters.clients.length > 0 && !filters.clients.includes(client.data)) {
          return false;
        }
        
        if (client.children) {
          client.children = client.children.filter(template => {
            if (filters.templates && filters.templates.length > 0 && !filters.templates.includes(template.data)) {
              return false;
            }
            
            if (template.children) {
              template.children = template.children.filter(siteEdition => {
                if (filters.siteEditions && filters.siteEditions.length > 0 && !filters.siteEditions.includes(siteEdition.data)) {
                  return false;
                }
                
                return true;
              });
            }
            
            return template.children && template.children.length > 0;
          });
        }
        
        return client.children && client.children.length > 0;
      });
    }
    
    return app.children && app.children.length > 0;
  });
}; 