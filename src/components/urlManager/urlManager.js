import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { GET_URLS } from "../../graphql/operations";
import { SUBMIT_URLS } from "../../graphql/operations";
import { Tree } from "primereact/tree";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUrls } from "../../redux/selectionSlice";
import { extractOptions } from "./treeUtils";
import { Filters } from "./filters";
 
export function UrlManager() {
  const { data, loading, error } = useQuery(GET_URLS);
  const [treeData, setTreeData] = useState([]);
  const [filteredTree, setFilteredTree] = useState([]);

  const [selectionKeys, setSelectionKeys] = useState({});

  const dispatch = useDispatch();
  const selectedUrls = useSelector((state) => state.selection.selectedUrls);

  const [submitUrls, { loading: submitting, error: submitError, data: submitData }] = useMutation(SUBMIT_URLS);

  // Construye la estructura del árbol a partir de los URLs
  function buildTree(urls) {
    const root = [];

    urls.forEach((url) => {
      const parts = url.replace("https://", "").split("/");
      let currentLevel = root;

      parts.forEach((part, idx) => {
        const pathKey = parts.slice(0, idx + 1).join("/");
        let node = currentLevel.find((n) => n.key === pathKey);

        if (!node) {
          node = {
            key: pathKey,
            label: part,
            children: [],
          };
          currentLevel.push(node);
        }

        currentLevel = node.children;
      });

      currentLevel.push({
        key: url,
        label: url,
        data: url,
        isLeaf: true,
      });
    });

    return root;
  }

  // Busca nodo por key en el árbol (para selección del árbol)
  function findNodeByKey(nodes, key) {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  }

  // Maneja cambio de selección en el árbol
  const onSelectionChange = (e) => {
    const keys = e.value;
    setSelectionKeys(keys);

    const checkedKeys = Object.entries(keys)
      .filter(([key, sel]) => sel.checked)
      .map(([key]) => key);

    const selectedLeafUrls = checkedKeys
      .map((key) => findNodeByKey(treeData, key))
      .filter((node) => node?.data)
      .map((node) => node.data);

    dispatch(setSelectedUrls(selectedLeafUrls));
  };

  // Construye el árbol base cuando llegan los datos
  useEffect(() => {
    if (data?.urls) {
      const parsed = buildTree(data.urls);
      setTreeData(parsed);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error al cargar URLs</div>;

  // Extraemos las opciones para los multiselects a partir del árbol base
  const filterOptions = extractOptions(treeData);

  const handleSubmit = async () => {
    if (selectedUrls.length === 0) {
        alert("No hay URLs seleccionadas para enviar.");
        return;
    }

    try {
        const { data } = await submitUrls({
        variables: {
            urls: selectedUrls,
        },
        });

        if (data?.submitUrls?.success) {
        alert("Envío exitoso: " + data.submitUrls.message);
        } else {
        alert("Falló el envío: " + (data?.submitUrls?.message || "Error desconocido"));
        }
    } catch (err) {
        console.error("Error al enviar:", err);
        alert("Ocurrió un error al enviar las URLs.");
    }
    };

  return (
    <div>
      <h2>URL Tree con filtros</h2>

      <Filters
        filterOptions={filterOptions}
        treeData={treeData}
        setFilteredTree={setFilteredTree}
      />

      <Tree
        value={filteredTree}
        selectionMode="checkbox"
        selectionKeys={selectionKeys}
        onSelectionChange={onSelectionChange}
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
        {submitting ? "Enviando..." : "Enviar URLs seleccionadas"}
        </button>

        {submitting && <p>Enviando...</p>}
        {submitError && <p style={{ color: "red" }}>Error al enviar: {submitError.message}</p>}
        {submitData?.submitUrls?.success && <p style={{ color: "green" }}>✔ {submitData.submitUrls.message}</p>}

      <h3>Selected URLs</h3>
      <ul>
        {selectedUrls.map((url) => (
          <li key={url}>{url}</li>
        ))}
      </ul>
    </div>
  );
}
