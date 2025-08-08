import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tree } from 'primereact/tree';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useQuery, useMutation } from '@apollo/client';
import { GET_URLS, SUBMIT_URLS } from '../graphql/operations';
import { selectSelectedUrls, selectSelectedCount, setSelection } from '../redux/selectionSlice';
import { buildTreeFromUrls, getChildUrls, filterTree, parseUrl } from '../utils/treeUtils';
import './urlManager.css';

const UrlManager = () => {
  const dispatch = useDispatch();
  const selectedUrls = useSelector(selectSelectedUrls);
  const selectedCount = useSelector(selectSelectedCount);
  
  // Estados locales
  const [treeData, setTreeData] = useState([]);
  const [filteredTreeData, setFilteredTreeData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState({});
  const [filters, setFilters] = useState({
    applications: [],
    clients: [],
    templates: [],
    siteEditions: []
  });
  
  // GraphQL queries
  const { loading, error, data } = useQuery(GET_URLS);
  const [submitUrls, { loading: submitting }] = useMutation(SUBMIT_URLS);
  
  // Efecto para construir el árbol cuando se cargan las URLs
  useEffect(() => {
    if (data?.urls) {
      const tree = buildTreeFromUrls(data.urls);
      setTreeData(tree);
      setFilteredTreeData(tree);
    }
  }, [data]);
  
  // Efecto para aplicar filtros
  useEffect(() => {
    if (treeData.length > 0) {
      const filtered = filterTree(treeData, filters);
      setFilteredTreeData(filtered);
    }
  }, [filters, treeData]);
  
  // Obtener opciones para los filtros
  const getFilterOptions = () => {
    const options = {
      applications: [],
      clients: [],
      templates: [],
      siteEditions: []
    };
    
    if (data?.urls) {
      data.urls.forEach(url => {
        const parsed = parseUrl(url);
        if (parsed) {
          if (!options.applications.includes(parsed.application)) {
            options.applications.push(parsed.application);
          }
          if (!options.clients.includes(parsed.client)) {
            options.clients.push(parsed.client);
          }
          if (!options.templates.includes(parsed.template)) {
            options.templates.push(parsed.template);
          }
          if (!options.siteEditions.includes(parsed.siteEdition)) {
            options.siteEditions.push(parsed.siteEdition);
          }
        }
      });
    }
    
    return options;
  };
  
  // Manejador de selección del árbol
  const handleSelectionChange = (e) => {
    setSelectedKeys(e.value);
    
    // Obtener todas las URLs seleccionadas
    const allSelectedUrls = new Set(); // Usar Set para evitar duplicados
    
    const processNode = (node) => {
      // Solo procesar nodos que están EXPLÍCITAMENTE seleccionados
      if (e.value[node.key] && e.value[node.key].checked) {
        if (node.leaf) {
          // Si es un nodo hoja, agregar la URL
          allSelectedUrls.add(node.data);
        } else {
          // Si es un nodo padre, obtener todas las URLs hijas
          const childUrls = getChildUrls(node);
          childUrls.forEach(url => allSelectedUrls.add(url));
        }
      }
      
      // Procesar hijos recursivamente
      if (node.children) {
        node.children.forEach(child => processNode(child));
      }
    };
    
    // Procesar todos los nodos del árbol
    filteredTreeData.forEach(node => processNode(node));
    
    // Convertir Set a Array y actualizar Redux
    const selectedUrlsArray = Array.from(allSelectedUrls);
    dispatch(setSelection(selectedUrlsArray));
  };
  
  // Manejador de filtros
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Manejador de envío
  const handleSubmit = async () => {
    if (selectedUrls.length === 0) {
      alert('Por favor selecciona al menos una URL');
      return;
    }
    
    try {
      const result = await submitUrls({
        variables: { urls: selectedUrls }
      });
      
      if (result.data?.submitUrls?.success) {
        alert('URLs enviadas exitosamente!');
        console.log('URLs enviadas:', selectedUrls);
        // Opcional: limpiar selección después del envío exitoso
        // dispatch(clearSelection());
      } else {
        alert('Error al enviar URLs');
      }
    } catch (error) {
      console.error('Error submitting URLs:', error);
      alert('Error al enviar URLs: ' + error.message);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando URLs...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <i className="pi pi-exclamation-triangle"></i>
      <h3>Error al cargar URLs</h3>
      <p>{error.message}</p>
    </div>
  );
  
  const filterOptions = getFilterOptions();
  
  return (
    <div className="url-manager">
      <div className="url-manager-content">
        {/* Filtros */}
        <Card className="filters-card">
          <div className="filters-header">
            <h3>Filtros</h3>
            <p>Filtra las URLs por categorías</p>
          </div>
          
          <div className="filters-grid">
            <div className="filter-item">
              <label>Applications</label>
              <MultiSelect
                value={filters.applications}
                onChange={(e) => handleFilterChange('applications', e.value)}
                options={filterOptions.applications.map(app => ({ label: app, value: app }))}
                placeholder="Seleccionar Applications"
                className="filter-select"
              />
            </div>
            
            <div className="filter-item">
              <label>Clients</label>
              <MultiSelect
                value={filters.clients}
                onChange={(e) => handleFilterChange('clients', e.value)}
                options={filterOptions.clients.map(client => ({ label: client, value: client }))}
                placeholder="Seleccionar Clients"
                className="filter-select"
              />
            </div>
            
            <div className="filter-item">
              <label>Templates</label>
              <MultiSelect
                value={filters.templates}
                onChange={(e) => handleFilterChange('templates', e.value)}
                options={filterOptions.templates.map(template => ({ label: template, value: template }))}
                placeholder="Seleccionar Templates"
                className="filter-select"
              />
            </div>
            
            <div className="filter-item">
              <label>Site Editions</label>
              <MultiSelect
                value={filters.siteEditions}
                onChange={(e) => handleFilterChange('siteEditions', e.value)}
                options={filterOptions.siteEditions.map(edition => ({ label: edition, value: edition }))}
                placeholder="Seleccionar Site Editions"
                className="filter-select"
              />
            </div>
          </div>
        </Card>
        
        {/* Árbol */}
        <Card className="tree-card">
          <div className="tree-header">
            <h3>Árbol de URLs</h3>
            <p>Selecciona URLs individuales o nodos completos</p>
          </div>
          
          <div className="tree-container">
            <Tree
              value={filteredTreeData}
              selectionMode="checkbox"
              selectionKeys={selectedKeys}
              onSelectionChange={handleSelectionChange}
              className="url-tree"
            />
          </div>
        </Card>
        
        {/* URLs Seleccionadas */}
        <Card className="selected-urls-card">
          <div className="selected-urls-header">
            <h3>URLs Seleccionadas</h3>
            <span className="url-count">{selectedCount} URL{selectedCount !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="selected-urls-content">
            {selectedUrls.length > 0 ? (
              <div className="urls-list">
                {selectedUrls.map((url, index) => (
                  <div key={index} className="url-item">
                    <i className="pi pi-link"></i>
                    <span className="url-text">{url}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-urls">
                <i className="pi pi-info-circle"></i>
                <p>No hay URLs seleccionadas</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Botón de envío */}
        <div className="submit-section">
          <Button
            label={submitting ? "Enviando..." : "Enviar URLs Seleccionadas"}
            icon={submitting ? "pi pi-spinner pi-spin" : "pi pi-send"}
            onClick={handleSubmit}
            disabled={selectedUrls.length === 0 || submitting}
            className="submit-button"
          />
          
          {selectedCount > 0 && (
            <div className="submit-info">
              <i className="pi pi-check-circle"></i>
              <span>{selectedCount} URL{selectedCount !== 1 ? 's' : ''} lista{selectedCount !== 1 ? 's' : ''} para enviar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlManager;