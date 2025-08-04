import { memo } from 'react';
import styles from './SelectionSummary.module.css';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';


const UrlItem = memo(({ url, index }) => (
  <div className={`${styles.listItem} ${index % 2 !== 0 ? styles.listItemAlt : ''}`}>
    <span className={`pi pi-link ${styles.linkIcon}`}></span>
    <span className={styles.urlText}>{url}</span>
  </div>
));

UrlItem.displayName = 'UrlItem';

const SelectionSummary = ({
  selectedUrls,
  onClearSelections,
  onSubmit,
  isSubmitting,
  submissionResult
}) => {
  const hasSelections = selectedUrls.length > 0;

  return (
    <div className={styles.summary}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Selected URLs ({selectedUrls.length})
          <Badge
            value={selectedUrls.length}
            severity={hasSelections ? "success" : "secondary"}
            className={styles.badge}
          />
        </h2>
        {hasSelections && (
          <Button
            label="Clear Selection"
            icon="pi pi-times"
            size="small"
            text
            severity="secondary"
            onClick={onClearSelections}
            className={styles.clearBtn}
          />
        )}
      </div>

      {!hasSelections ? (
        <div className={styles.noSelection}>
          <span className="pi pi-info-circle" style={{ marginRight: '8px' }}></span>
          No URLs selected
        </div>
      ) : (
        <div className={styles.list}>
          {selectedUrls.map((url, index) => (
            <UrlItem key={url} url={url} index={index} />
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <Button
          label="Submit URLs"
          icon="pi pi-send"
          loading={isSubmitting}
          disabled={!hasSelections || isSubmitting}
          onClick={onSubmit}
        />
        {submissionResult && (
          <div
            className={`${styles.result} ${submissionResult.success ? styles.resultSuccess : styles.resultError}`}
          >
            <i className={`pi ${submissionResult.success ? 'pi-check' : 'pi-times'} ${styles.resultIcon}`}></i>
            {submissionResult.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(SelectionSummary); 