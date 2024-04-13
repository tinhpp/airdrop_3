import { upperCaseFirstLetter } from '@src/utils';
import styles from '../../styles.module.scss';

export default function Traits({ attributes = [] }) {
  return (
    <div className={styles.traits}>
      {attributes.map((attribute, index) => (
        <div key={index} className={styles.trait}>
          <div className={styles['trait-type']}>{attribute?.trait_type || ''}</div>
          <div className={styles['trait-value']}>{upperCaseFirstLetter(attribute?.value) || ''}</div>
        </div>
      ))}
    </div>
  );
}
