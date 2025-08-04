import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react'
import { filterTree } from './treeUtils';

export function Filters({ filterOptions, treeData, setFilteredTree }) {

    // Estados para filtros multiselección
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [selectedEditions, setSelectedEditions] = useState([]);

    useEffect(() => {
        const filtered = filterTree(
          treeData,
          selectedApplications,
          selectedClients,
          selectedTemplates,
          selectedEditions
        );
        setFilteredTree(filtered);
      }, [treeData, selectedApplications, selectedClients, selectedTemplates, selectedEditions, setFilteredTree]);


  return (
    <div>
      {/* Filtros multiselección */}
            <MultiSelect
              value={selectedApplications}
              options={filterOptions.applications}
              onChange={(e) => setSelectedApplications(e.value)}
              placeholder="Select Applications"
              display="chip"
              className="mb-2"
            />
            <MultiSelect
              value={selectedClients}
              options={filterOptions.clients}
              onChange={(e) => setSelectedClients(e.value)}
              placeholder="Select Clients"
              display="chip"
              className="mb-2"
            />
            <MultiSelect
              value={selectedTemplates}
              options={filterOptions.templates}
              onChange={(e) => setSelectedTemplates(e.value)}
              placeholder="Select Templates"
              display="chip"
              className="mb-2"
            />
            <MultiSelect
              value={selectedEditions}
              options={filterOptions.editions}
              onChange={(e) => setSelectedEditions(e.value)}
              placeholder="Select Site Editions"
              display="chip"
              className="mb-2"
            />
    </div>
  )
}

