import { parseUrlComponents } from './urlUtils';
import { FILTERS } from '../constants';

/**
 * Extrae opciones únicas para los filtros desde las URLs
 * @param {string[]} urls - Array de URLs
 * @returns {Object} - Opciones para cada filtro
 */
export const extractFilterOptions = (urls) => {
  if (!Array.isArray(urls) || urls.length === 0) {
    return {
      applications: [],
      clients: [],
      templates: [],
      siteEditions: [],
    };
  }
  
  const sets = {
    applications: new Set(),
    clients: new Set(),
    templates: new Set(),
    siteEditions: new Set(),
  };
  
  urls.forEach(url => {
    const components = parseUrlComponents(url);
    if (!components) return;
    
    const { application, client, template, siteEdition } = components;
    
    if (application) sets.applications.add(application);
    if (client) sets.clients.add(client);
    if (template) sets.templates.add(template);
    if (siteEdition) sets.siteEditions.add(siteEdition);
  });
  
  return {
    applications: Array.from(sets.applications).sort(),
    clients: Array.from(sets.clients).sort(),
    templates: Array.from(sets.templates).sort(),
    siteEditions: Array.from(sets.siteEditions).sort(),
  };
};

/**
 * Valida si un conjunto de filtros es válido
 * @param {Object} filters - Objeto de filtros
 * @returns {boolean} - True si es válido
 */
export const validateFilters = (filters) => {
  if (!filters || typeof filters !== 'object') return false;
  
  const requiredKeys = Object.values(FILTERS);
  return requiredKeys.every(key => key in filters);
};

/**
 * Cuenta cuántos filtros están activos
 * @param {Object} filters - Objeto de filtros
 * @returns {number} - Número de filtros activos
 */
export const countActiveFilters = (filters) => {
  if (!validateFilters(filters)) return 0;
  
  return Object.values(filters).filter(value => value && value !== '').length;
};

/**
 * Crea un objeto de opciones para MultiSelect basado en las opciones de filtros
 * @param {Object} filterOptions - Opciones extraídas de las URLs
 * @returns {Object} - Opciones formateadas para MultiSelect
 */
export const formatOptionsForMultiSelect = (filterOptions) => {
  const formatArray = (arr = [], labelKey) => 
    arr.map(item => ({
      label: item,
      value: item,
      key: `${labelKey}-${item}`
    }));
  
  return {
    applications: formatArray(filterOptions.applications, 'app'),
    clients: formatArray(filterOptions.clients, 'client'),
    templates: formatArray(filterOptions.templates, 'template'),
    siteEditions: formatArray(filterOptions.siteEditions, 'edition'),
  };
};

export function buildTreeFromUrls(urls) {
  const root = {};

  urls.forEach((url) => {
    const path = url.replace(/^https?:\/\//, '');
    const parts = path.split('/');

    let currentLevel = root;

    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        currentLevel[part] = {
          key: parts.slice(0, index + 1).join('/'),
          label: part,
          children: {},
        };
      }

      currentLevel = currentLevel[part].children;
    });
  });
        
  function convertToTreeNodes(obj) {
    return Object.values(obj).map((node) => ({
      key: node.key,
      label: node.label,
      children: Object.keys(node.children).length
        ? convertToTreeNodes(node.children)
        : undefined,
    }));
  }

  return convertToTreeNodes(root);
}