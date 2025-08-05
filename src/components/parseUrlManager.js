function urlsToTree(urls) {
  const tree = [];

  urls.forEach((url) => {
    const cleanUrl = url.replace("https://", "");
    const parts = cleanUrl.split("/");
    console.log("Processing URL parts:", parts);
    const [app, client, template, edition] = parts;

    const fullUrl = url;

    let appNode = tree.find((n) => n.label === app);
    if (!appNode) {
      appNode = { key: app, label: app, children: [] };
      tree.push(appNode);
    }

    let clientNode = appNode.children.find((n) => n.label === client);
    if (!clientNode) {
      clientNode = {
        key: `${app}/${client}`,
        label: client,
        children: [],
      };
      appNode.children.push(clientNode);
    }

    let templateNode = clientNode.children.find((n) => n.label === template);
    if (!templateNode) {
      templateNode = {
        key: `${app}/${client}/${template}`,
        label: template,
        children: [],
      };
      clientNode.children.push(templateNode);
    }

    let editionNode = templateNode.children.find((n) => n.label === edition);
    if (!editionNode) {
      editionNode = {
        key: `${app}/${client}/${template}/${edition}`,
        label: edition,
        children: [],
      };
      templateNode.children.push(editionNode);
    }

    editionNode.children.push({
      key: fullUrl,
      label: fullUrl,
      data: { url: fullUrl }, // útil para Redux
      leaf: true,
    });
  });
  console.log("Tree structure:", tree);
  return tree;
}
export default urlsToTree;
