import { useQuery } from '@apollo/client';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import FilterPanel from '../Filter/Filter';
import UrlTree from '../UrlTree/UrlTree';
import SelectionSummary from '../SelectionSummary/SelectionSummary';

import { useUrlManager } from '../../hooks/useUrlManager';
import { GET_URLS } from '../../graphql/operations';
import { MESSAGES } from '../../constants';

const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '2rem',
    gap: '1rem'
  }}>
    <ProgressSpinner size="50" strokeWidth="4" />
    <span>{MESSAGES.LOADING}</span>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '2rem',
    gap: '1rem'
  }}>
    <Message 
      severity="error" 
      text={error?.message || MESSAGES.ERROR} 
    />
    {onRetry && (
      <Button 
        label={MESSAGES.RETRY}
        icon="pi pi-refresh" 
        onClick={onRetry}
        severity="secondary"
      />
    )}
  </div>
);

const UrlManager = () => {
  const { loading, error, data, refetch } = useQuery(GET_URLS);

  const {
    selectedUrls,
    filters,
    filterOptions,
    treeNodes,
    selectedKeys,
    isSubmitting,
    submissionResult,
    handleSelectionChange,
    handleFilterChange,
    handleClearFilters,
    handleClearSelections,
    handleSubmitUrls,
    hasActiveFilters,
    hasSelectedUrls,
    filteredUrlsCount,
    totalUrlsCount,
  } = useUrlManager(data);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <FilterPanel
        filters={filters}
        filterOptions={filterOptions}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <UrlTree
        nodes={treeNodes}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange}
      />

      <SelectionSummary
        selectedUrls={selectedUrls}
        onClearSelections={handleClearSelections}
        onSubmit={handleSubmitUrls}
        isSubmitting={isSubmitting}
        submissionResult={submissionResult}
        hasSelectedUrls={hasSelectedUrls}
        filteredCount={filteredUrlsCount}
        totalCount={totalUrlsCount}
      />
    </div>
  );
};

export default UrlManager; 