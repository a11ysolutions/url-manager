export const filterUrls = (allUrls, filters) => {
  const { apps, clients, templates, editions } = filters;
  return allUrls.filter(urlObj => {
    const matchApp = apps.length === 0 || apps.includes(urlObj.app);
    const matchClient = clients.length === 0 || clients.includes(urlObj.client);
    const matchTemplate = templates.length === 0 || templates.includes(urlObj.template);
    const matchEdition = editions.length === 0 || editions.includes(urlObj.edition);
    return matchApp && matchClient && matchTemplate && matchEdition;
  });
};