import { parseUrlComponents } from './urlUtils';

export const extractFilterOptions = (urls) => {
  if (!Array.isArray(urls) || urls.length === 0) {
    return { applications: [], clients: [], templates: [], siteEditions: [] };
  }

  const options = { applications: [], clients: [], templates: [], siteEditions: [] };
  const seen = { applications: new Set(), clients: new Set(), templates: new Set(), siteEditions: new Set() };

  urls.forEach(url => {
    const components = parseUrlComponents(url);
    if (!components) return;

    const { application, client, template, siteEdition } = components;
    
    if (application && !seen.applications.has(application)) {
      seen.applications.add(application);
      options.applications.push(application);
    }
    if (client && !seen.clients.has(client)) {
      seen.clients.add(client);
      options.clients.push(client);
    }
    if (template && !seen.templates.has(template)) {
      seen.templates.add(template);
      options.templates.push(template);
    }
    if (siteEdition && !seen.siteEditions.has(siteEdition)) {
      seen.siteEditions.add(siteEdition);
      options.siteEditions.push(siteEdition);
    }
  });

  // Sort all arrays
  Object.keys(options).forEach(key => options[key].sort());
  return options;
};