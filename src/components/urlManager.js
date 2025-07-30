import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { Tree } from 'primereact/tree';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
import { GET_URLS, SUBMIT_URLS } from '../graphql/operations';
import { setSelectedUrls, setFilters, clearFilters } from '../redux/selectionSlice';

const buildTree = (urls) => {
    const tree = {};
    const options = {
        applications: new Set(),
        clients: new Set(),
        templates: new Set(),
        siteEditions: new Set(),
    };
    urls.forEach((url) => {
        try {
            const urlObj = new URL(url);
            const application = urlObj.hostname;
            const pathParts = urlObj.pathname.split('/').filter(Boolean);
            if (pathParts.length !== 3) return;
            const [client, template, siteEdition] = pathParts;

            options.applications.add(application);
            options.clients.add(client);
            options.templates.add(template);
            options.siteEditions.add(siteEdition);

            let currentNode = tree;
            const hierarchy = [
                { key: application, type: 'application', value: application },
                { key: `${application}/${client}`, type: 'client', value: client },
                { key: `${application}/${client}/${template}`, type: 'template', value: template },
                { key: `${application}/${client}/${template}/${siteEdition}`, type: 'siteEdition', value: siteEdition },
                { key: url, type: 'url', value: url, leaf: true },
            ];

            hierarchy.forEach((item) => {
                if (!currentNode[item.value]) {
                    currentNode[item.value] = {
                        key: item.key,
                        label: item.value,
                        data: { type: item.type, value: item.value },
                        children: item.leaf ? undefined : {},
                        leaf: item.leaf,
                    };
                }
                currentNode = currentNode[item.value].children || {};
            });
        } catch (error) {
            console.warn('Invalid URL:', url);
        }
    });

    return { tree, options };
};

const convertToArray = (obj) => {
    return Object.values(obj).map((node) => ({
        ...node,
        children: node.children && Object.keys(node.children).length > 0
            ? convertToArray(node.children)
            : undefined,
    }));
};

const urlPassesFilters = (urlNode, filters) => {
    const urlKey = urlNode.key;
    const pathParts = urlKey.split('/');

    if (pathParts.length < 4) return false;
    try {
        const urlObj = new URL(urlKey);
        const application = urlObj.hostname;
        const [client, template, siteEdition] = urlObj.pathname.split('/').filter(Boolean);
        const checks = [
            { type: 'applications', value: application },
            { type: 'clients', value: client },
            { type: 'templates', value: template },
            { type: 'siteEditions', value: siteEdition }
        ];
        return checks.every(({ type, value }) =>
            !filters[type] ||
            filters[type].length === 0 ||
            filters[type].includes(value)
        );
    } catch {
        return false;
    }
};

const applyFilters = (nodes, filters, nodeMap = {}) => {
    const hasActiveFilters = Object.values(filters).some((filter) => filter.length > 0);
    if (!hasActiveFilters) return nodes;
    return nodes
        .map((node) => {
            if (node.leaf) {
                return urlPassesFilters(node, filters, nodeMap) ? node : null;
            }
            const filteredChildren = node.children ? applyFilters(node.children, filters, nodeMap) : [];
            if (filteredChildren.length > 0) {
                return {
                    ...node,
                    children: filteredChildren
                };
            }
            return null;
        })
        .filter(Boolean);
};

const UrlManager = () => {
    const dispatch = useDispatch();
    const { selectedUrls, filters } = useSelector((state) => state.selection);
    const [selectedKeys, setSelectedKeys] = useState({});
    const { data, loading, error } = useQuery(GET_URLS);
    const [submitUrls, { loading: submitting }] = useMutation(SUBMIT_URLS);

    const { treeData, filterOptions, nodeMap } = useMemo(() => {
        if (!data?.urls) return { treeData: [], filterOptions: {}, nodeMap: {} };
        const { tree, options } = buildTree(data.urls);
        let treeArray = convertToArray(tree);

        const nodeMap = {};
        const buildNodeMap = (nodes) => {
            nodes.forEach((node) => {
                nodeMap[node.key] = node;
                if (node.children) buildNodeMap(node.children);
            });
        };
        buildNodeMap(treeArray);
        treeArray = applyFilters(treeArray, filters, nodeMap);
        return {
            treeData: treeArray,
            filterOptions: {
                applications: Array.from(options.applications).sort(),
                clients: Array.from(options.clients).sort(),
                templates: Array.from(options.templates).sort(),
                siteEditions: Array.from(options.siteEditions).sort(),
            },
            nodeMap,
        };
    }, [data, filters]);

    const onSelectionChange = (e) => {
        setSelectedKeys(e.value);
        const allSelectedUrls = Object.keys(e.value)
            .filter((key) => e.value[key] && nodeMap[key]?.leaf)
            .map((key) => nodeMap[key].data.value);
        dispatch(setSelectedUrls(allSelectedUrls));
    };

    const handleSubmit = async () => {
        if (selectedUrls.length === 0) {
            alert('Please select at least one URL');
            return;
        }
        try {
            const result = await submitUrls({
                variables: { urls: selectedUrls },
            });
            if (result.data?.submitUrls?.success) {
                alert(`Successfully submitted ${selectedUrls.length} URLs!`);
                console.log('Submitted URLs:', selectedUrls);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting URLs');
        }
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    const handleClearSelection = () => {
        setSelectedKeys({});
        dispatch(setSelectedUrls([]));
    };

    if (loading) return <div aria-live="polite" role="status">Loading URLs...</div>;
    if (error) return (
        <div aria-live="polite" role="alert" style={{ color: '#f44336', padding: '20px' }}>
            Error loading URLs: {error.message}
        </div>
    );

    const filterConfigs = [
        { key: 'applications', label: 'Applications' },
        { key: 'clients', label: 'Clients' },
        { key: 'templates', label: 'Templates' },
        { key: 'siteEditions', label: 'Site Editions' },
    ];

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <header>
                <h1 style={{ textAlign: 'center', color: '#4CAF50', marginBottom: '30px', fontSize: '2.5rem' }}>
                    🌳 URL Manager
                </h1>
            </header>
            <main>
                <Panel
                    header="🔍 Filters"
                    style={{ marginBottom: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    aria-label="URL Filters"
                >
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px',
                    }}>
                        {filterConfigs.map(({ key, label }) => (
                            <div key={key}>
                                <label
                                    htmlFor={`filter-${key}`}
                                    style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}
                                >
                                    {label}:
                                </label>
                                <MultiSelect
                                    id={`filter-${key}`}
                                    value={filters[key]}
                                    options={filterOptions[key]?.map((item) => ({ label: item, value: item }))}
                                    onChange={(e) => dispatch(setFilters({ [key]: e.value }))}
                                    placeholder={`Select ${label}`}
                                    style={{ width: '100%', borderRadius: '8px' }}
                                    showClear
                                    aria-label={`Filter by ${label}`}
                                    aria-describedby={`filter-${key}-desc`}
                                />
                            </div>
                        ))}
                    </div>
                    <Button
                        label="Clear All Filters"
                        onClick={handleClearFilters}
                        className="p-button-secondary"
                        size="small"
                        style={{ borderRadius: '8px', backgroundColor: '#f44336', color: '#fff', border: 'none' }}
                        aria-label="Clear all applied filters"
                    />
                </Panel>
                <Panel
                    header="🌳 URL Tree"
                    style={{ marginBottom: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    aria-label="URL Tree Navigation"
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                    }}>
                        <div aria-live="polite" style={{ color: '#666', fontSize: '1rem' }}>
                            {selectedUrls.length > 0
                                ? `${selectedUrls.length} URL(s) selected`
                                : 'No URLs selected'}
                        </div>
                        <Button
                            label="Clear Selection"
                            onClick={handleClearSelection}
                            className="p-button-outlined p-button-secondary"
                            size="small"
                            disabled={selectedUrls.length === 0}
                            icon="pi pi-times"
                            style={{ borderRadius: '8px', borderColor: '#f44336', color: '#f44336' }}
                            aria-label="Clear all selected URLs"
                        />
                    </div>
                    <Tree
                        value={treeData}
                        selectionMode="checkbox"
                        selectionKeys={selectedKeys}
                        onSelectionChange={onSelectionChange}
                        style={{ width: '100%' }}
                        className="w-full md:w-30rem"
                        aria-label="URL Tree for selection"
                        role="tree"
                    />
                </Panel>
                <Panel
                    header={`✅ Selected URLs (${selectedUrls.length})`}
                    style={{ marginBottom: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    aria-label="Selected URLs List"
                >
                    {selectedUrls.length === 0 ? (
                        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
                            No URLs selected. Select nodes in the tree above to see URLs here.
                        </p>
                    ) : (
                        <div
                            style={{ maxHeight: '200px', overflowY: 'auto', padding: '10px', backgroundColor: '#fff', borderRadius: '8px' }}
                            role="region"
                            aria-label="List of selected URLs"
                            tabIndex="0"
                        >
                            <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'none' }}>
                                {selectedUrls.map((url) => (
                                    <li key={url} style={{ marginBottom: '5px', color: '#333' }}>
                                        <code>{url}</code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Panel>
                <Card
                    style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    aria-label="Submit URLs Section"
                >
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Button
                            label={submitting ? 'Submitting...' : `Submit ${selectedUrls.length} URLs`}
                            onClick={handleSubmit}
                            disabled={submitting || selectedUrls.length === 0}
                            className="p-button-success"
                            size="large"
                            style={{ borderRadius: '8px', backgroundColor: '#4CAF50', color: '#fff', border: 'none' }}
                            aria-label={`Submit ${selectedUrls.length} selected URLs`}
                            aria-describedby="submit-description"
                        />
                        <div id="submit-description" className="sr-only">
                            Click to submit all selected URLs for processing
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default UrlManager;
