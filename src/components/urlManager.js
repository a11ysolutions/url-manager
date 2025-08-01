import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tree } from 'primereact/tree';
import { MultiSelect } from 'primereact/multiselect';
import { useQuery, useMutation } from '@apollo/client';
import { GET_URLS, SUBMIT_URLS } from '../graphql/operations';
import { buildTree, transformToPrimeTree } from '../utils/urlTreeBuilder';
import { setSelectedUrls } from '../redux/selectedUrlsSlice';
import { filterUrls } from '../utils/urlFilters';

const UrlManager = ({ appOptions, clientsOptions, templatesOptions, editionsOptions }) => {
  const [nodes, setNodes] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState({});
  const [selectedApps, setSelectedApps] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [selectedEditions, setSelectedEditions] = useState([]);

  const dispatch = useDispatch();
  const selectedUrls = useSelector((state) => state.selectedUrls.selectedUrls);

  // Apollo Client hooks
  const { data, loading, error } = useQuery(GET_URLS);
  const [submitUrls] = useMutation(SUBMIT_URLS);

  // Función para convertir URLs en objetos para poder filtrarlas
  const parseUrls = (urls) => {
    return urls.map(u => {
      const [ , app, client, template, edition ] = u.replace('https://','').split('/');
      return { app, client, template, edition, fullUrl: u };
    });
  };

  // Construir y actualizar el árbol cuando cambien datos o filtros
  useEffect(() => {
    if (!data || !data.urls) return;

    const parsed = parseUrls(data.urls);
    const filtered = filterUrls(parsed, {
      apps: selectedApps,
      clients: selectedClients,
      templates: selectedTemplates,
      editions: selectedEditions
    });

    // Crear estructura para PrimeReact Tree
    const rawTree = buildTree(filtered.map(item => item.fullUrl));
    const primeTree = transformToPrimeTree(rawTree);
    setNodes(primeTree);
  }, [data, selectedApps, selectedClients, selectedTemplates, selectedEditions]);

  // Buscar URL hoja por key
  const findNodeUrl = (nodes, key) => {
    for (const node of nodes) {
      if (node.key === key && node.data?.url) return node.data.url;
      if (node.children) {
        const found = findNodeUrl(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // Manejo de selección
  const onSelectionChange = (e) => {
    setSelectedKeys(e.value);

    const selectedLeafUrls = Object.entries(e.value)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => findNodeUrl(nodes, key))
      .filter(url => url);

    dispatch(setSelectedUrls(selectedLeafUrls));
  };

  // Enviar URLs seleccionadas por mutación
  const handleSubmit = async () => {
    if (selectedUrls.length === 0) {
      alert("No hay URLs seleccionadas");
      return;
    }
    try {
      const response = await submitUrls({ variables: { urls: selectedUrls } });
      console.log("✅ URLs enviadas:", selectedUrls);
      console.log("Respuesta GraphQL:", response.data);
      alert("Envío exitoso");
    } catch (err) {
      console.error("Error al enviar URLs:", err);
    }
  };

  if (loading) return <p>Cargando URLs...</p>;
  if (error) return <p>Error al cargar datos</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <MultiSelect value={selectedApps} options={appOptions} onChange={(e) => setSelectedApps(e.value)} placeholder="Aplicaciones" />
        <MultiSelect value={selectedClients} options={clientsOptions} onChange={(e) => setSelectedClients(e.value)} placeholder="Clientes" />
        <MultiSelect value={selectedTemplates} options={templatesOptions} onChange={(e) => setSelectedTemplates(e.value)} placeholder="Plantillas" />
        <MultiSelect value={selectedEditions} options={editionsOptions} onChange={(e) => setSelectedEditions(e.value)} placeholder="Ediciones" />

        <Tree
          value={nodes}
          selectionMode="checkbox"
          selectionKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
          propagateSelectionUp
          propagateSelectionDown
        />

        <button onClick={handleSubmit} style={{ marginTop: '10px' }}>
          Enviar URLs Seleccionadas
        </button>

        <h4>URLs seleccionadas:</h4>
        <ul>
          {selectedUrls.map((url, index) => (
            <li key={index}>{url}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UrlManager;
