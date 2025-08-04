export function extractOptions(tree) {
    const applications = new Set();
    const clients = new Set();
    const templates = new Set();
    const editions = new Set();

    tree.forEach((app) => {
        applications.add(app.label);

        app.children.forEach((client) => {
            clients.add(client.label);

            client.children.forEach((template) => {
                templates.add(template.label);

                template.children.forEach((edition) => {
                    editions.add(edition.label);
                });
            });
        });
    });

    return {
        applications: Array.from(applications),
        clients: Array.from(clients),
        templates: Array.from(templates),
        editions: Array.from(editions),
    };
}

export function filterTree(tree, apps, clients, templates, editions) {
    return tree
        .filter((app) => apps.length === 0 || apps.includes(app.label))
        .map((app) => ({
            ...app,
            children: app.children
                .filter((client) => clients.length === 0 || clients.includes(client.label))
                .map((client) => ({
                    ...client,
                    children: client.children
                        .filter((template) => templates.length === 0 || templates.includes(template.label))
                        .map((template) => ({
                            ...template,
                            children: template.children.filter(
                                (edition) => editions.length === 0 || editions.includes(edition.label)
                            ),
                        })),
                })),
        }))
        .filter((app) => app.children.length > 0);
}