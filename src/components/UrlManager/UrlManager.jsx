import { useQuery } from '@apollo/client';
import FilterPanel from '../Filter/Filter';
import UrlTree from '../UrlTree/UrlTree';
import SelectionSummary from '../SelectionSummary/SelectionSummary';

import { useUrlManager } from '../../hooks/useUrlManager';
import { GET_URLS } from '../../graphql/operations';


const UrlManager = () => {
  const { data } = useQuery(GET_URLS);

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
    handleClearSelections,
    handleSubmitUrls,
  } = useUrlManager(data);


  return (
    <div>
      <FilterPanel
        filters={filters}
        filterOptions={filterOptions}
        onChange={handleFilterChange}
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
      />
    </div>
  );
};

export default UrlManager; 