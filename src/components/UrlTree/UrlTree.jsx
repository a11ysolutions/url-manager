import styles from './UrlTree.module.css';
import { Tree } from 'primereact/tree';
import { ProgressSpinner } from 'primereact/progressspinner';
import { MESSAGES } from '../../constants';

const UrlTree = ({ 
  nodes, 
  selectedKeys, 
  onSelectionChange, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div>
        <ProgressSpinner size="50" strokeWidth="4" />
        <span>{MESSAGES.LOADING}</span>
      </div>
    );
  }
  
  if (!nodes || nodes.length === 0) {
    return (
      <div>
        <i></i>
        <p>
          {MESSAGES.NO_MATCH}
        </p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.title}>URL Tree</div>
      <Tree
        value={nodes}
        selectionMode="checkbox"
        selectionKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
};

export default UrlTree;