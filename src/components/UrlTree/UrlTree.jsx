import styles from './UrlTree.module.css';
import { Tree } from 'primereact/tree';

const UrlTree = ({ nodes, selectedKeys, onSelectionChange }) => {
  if (!nodes || nodes.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.title}>URL Tree</div>
      <Tree
        value={nodes}
        selectionMode="checkbox"
        selectionKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        className={styles.tree}
      />
    </div>
  );
};

export default UrlTree;