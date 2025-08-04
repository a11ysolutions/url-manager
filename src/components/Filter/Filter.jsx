import styles from './Filter.module.css';
import { MultiSelect } from 'primereact/multiselect';
import { FILTERS } from '../../constants';

const FilterPanel = ({ filterOptions, filters, onChange }) => {
  const filterConfig = [
    { key: FILTERS.APPLICATION, label: 'Application', options: filterOptions.applications || [] },
    { key: FILTERS.CLIENT, label: 'Client', options: filterOptions.clients || [] },
    { key: FILTERS.TEMPLATE, label: 'Template', options: filterOptions.templates || [] },
    { key: FILTERS.SITE_EDITION, label: 'Site Edition', options: filterOptions.siteEditions || [] },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Filters</h2>
      <div className={styles.panel}>
        <div className={styles.filtersRow}>
          {filterConfig.map(({ key, label, options }) => (
            <div key={key} className={styles.filterItem}>
              <label className={styles.label}>{label}</label>
              <MultiSelect
                value={filters[key] || []}
                options={options.map(option => ({ label: option, value: option }))}
                onChange={(e) => onChange(key, e.value)}
                placeholder={`Select ${label}`}
                showClear
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;