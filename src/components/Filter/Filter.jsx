import styles from './Filter.module.css';
import { MultiSelect } from 'primereact/multiselect';
import { FILTERS } from '../../constants';

const FilterPanel = ({
  filterOptions,
  filters,
  onChange,
  onClear,
  hasActiveFilters,
}) => {
  const formatOptionsForSelect = (options) =>
    options.map(option => ({ label: option, value: option }));

  const filterConfig = [
    { key: FILTERS.APPLICATION, label: 'Application', options: formatOptionsForSelect(filterOptions.applications || []) },
    { key: FILTERS.CLIENT, label: 'Client', options: formatOptionsForSelect(filterOptions.clients || []) },
    { key: FILTERS.TEMPLATE, label: 'Template', options: formatOptionsForSelect(filterOptions.templates || []) },
    { key: FILTERS.SITE_EDITION, label: 'Site Edition', options: formatOptionsForSelect(filterOptions.siteEditions || []) },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Filters</h2>
      </div>
      
      <div className={styles.panel}>
        <div className={styles.filtersRow}>
          {filterConfig.map(({ key, label, options }) => (
            <div key={key} className={styles.filterItem}>
              <label className={styles.label}>{label}</label>
              <MultiSelect
                value={filters[key] || []}
                options={options}
                onChange={(e) => onChange(key, e.value)}
                placeholder={`Select ${label}`}
                showClear={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;