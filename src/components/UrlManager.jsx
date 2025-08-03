import urlsToTree from "./parseUrlManager.js";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { Tree } from "primereact/tree";
import { MultiSelect } from "primereact/multiselect";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { setSelection } from "../redux/selectionSlice.js";

const UrlManager = () => {
  const urls = [
    "https://dashboard/globex/landing/v2",
    "https://portal/globex/blog/dev",
    "https://dashboard/acme/news/v2",
    "https://platform/initech/blog/v2",
    "https://platform/acme/profile/staging",
    "https://portal/umbrella/news/staging",
    "https://platform/globex/shop/prod",
    "https://cms/acme/landing/dev",
    "https://admin/wonka/blog/v1",
    "https://cms/globex/news/v2",
    "https://admin/umbrella/shop/dev",
    "https://cms/initech/landing/staging",
    "https://platform/initech/landing/staging",
    "https://admin/umbrella/blog/v2",
    "https://portal/globex/profile/staging",
    "https://cms/initech/landing/dev",
    "https://platform/umbrella/shop/dev",
    "https://cms/initech/shop/dev",
    "https://portal/wonka/shop/dev",
    "https://portal/acme/news/v1",
    "https://portal/acme/news/staging",
    "https://cms/wonka/profile/dev",
    "https://dashboard/umbrella/landing/staging",
    "https://admin/globex/news/dev",
    "https://admin/acme/shop/prod",
    "https://platform/acme/news/prod",
    "https://dashboard/wonka/landing/staging",
    "https://cms/umbrella/shop/staging",
    "https://platform/wonka/blog/staging",
    "https://admin/umbrella/profile/prod",
    "https://admin/globex/landing/v2",
    "https://portal/initech/shop/staging",
    "https://portal/acme/landing/prod",
    "https://dashboard/acme/shop/dev",
    "https://admin/globex/shop/staging",
    "https://portal/acme/shop/prod",
    "https://admin/wonka/news/staging",
    "https://cms/acme/profile/prod",
    "https://cms/wonka/profile/staging",
    "https://portal/globex/landing/prod",
    "https://cms/initech/shop/prod",
    "https://dashboard/umbrella/landing/dev",
    "https://cms/acme/news/prod",
    "https://admin/wonka/landing/staging",
    "https://portal/acme/profile/v2",
    "https://dashboard/umbrella/news/v1",
    "https://platform/initech/news/v2",
    "https://cms/umbrella/blog/prod",
    "https://platform/umbrella/blog/v2",
    "https://dashboard/wonka/shop/v2",
  ];

  const dispatch = useDispatch();
  const selection = useSelector((state) => state.selection);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState({});

  const [appFilter, setAppFilter] = useState([]);
  const [clientFilter, setClientFilter] = useState([]);
  const [templateFilter, setTemplateFilter] = useState([]);
  const [editionFilter, setEditionFilter] = useState([]);

  /************************************************************************************************************ */

  const filtersData = useMemo(() => {
    const data = urls.map((url) => url.replace("https://", "").split("/"));
    return {
      apps: [...new Set(data.map((parts) => parts[0]))],
      clients: [...new Set(data.map((parts) => parts[1]))],
      templates: [...new Set(data.map((parts) => parts[2]))],
      editions: [...new Set(data.map((parts) => parts[3]))],
    };
  }, []);

  const filteredUrls = useMemo(() => {
    return urls.filter((url) => {
      const [app, client, template, edition] = url
        .replace("https://", "")
        .split("/");
      return (
        (appFilter.length === 0 || appFilter.includes(app)) &&
        (clientFilter.length === 0 || clientFilter.includes(client)) &&
        (templateFilter.length === 0 || templateFilter.includes(template)) &&
        (editionFilter.length === 0 || editionFilter.includes(edition))
      );
    });
  }, [urls, appFilter, clientFilter, templateFilter, editionFilter]);

  const treeData = useMemo(() => urlsToTree(filteredUrls), [filteredUrls]);

  /************************************************************************************************************ */
  const onSelectionChange = (e) => {
    const newSelectedKeys = e.value;
    setSelectedKeys(newSelectedKeys);

    const selectedLeafUrls = Object.keys(newSelectedKeys).filter((key) =>
      urls.includes(key)
    );

    dispatch(setSelection(selectedLeafUrls));
    console.log("Selected URLs:", selectedLeafUrls);
  };
  return (
    <div className="p-4">
      <h3>Gestor de Árbol de URLs con Filtros</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <MultiSelect
          value={appFilter}
          options={filtersData.apps}
          onChange={(e) => setAppFilter(e.value)}
          placeholder="Filtrar por Aplicación"
        />
        <MultiSelect
          value={clientFilter}
          options={filtersData.clients}
          onChange={(e) => setClientFilter(e.value)}
          placeholder="Filtrar por Cliente"
        />
        <MultiSelect
          value={templateFilter}
          options={filtersData.templates}
          onChange={(e) => setTemplateFilter(e.value)}
          placeholder="Filtrar por Template"
        />
        <MultiSelect
          value={editionFilter}
          options={filtersData.editions}
          onChange={(e) => setEditionFilter(e.value)}
          placeholder="Filtrar por Edición"
        />
      </div>

      <Tree
        value={treeData}
        selectionMode="checkbox"
        selectionKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        metaKeySelection={false}
      />

      <h4 className="mt-4">URLs seleccionadas:</h4>
      <ul>
        {selection.map((url) => (
          <li key={url}>{url}</li>
        ))}
      </ul>
    </div>
  );
};

export default UrlManager;
