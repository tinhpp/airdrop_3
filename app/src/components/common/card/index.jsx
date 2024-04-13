/* eslint-disable react/prop-types */
import { useImageLoaded } from '@src/hooks/useImageLoaded';
import { DEFAULT_NO_IMAGE } from '@src/constants';
import styles from './styles.module.scss';
import Skeleton from 'react-loading-skeleton';

export default function Card({ item, action: { text, handle }, style = {} }) {
  const [ref, loaded, onLoad] = useImageLoaded();

  return (
    <div className={styles.card} style={style}>
      <div className={styles['image-wrap']}>
        <img
          ref={ref}
          src={item.metadata?.image || item.metadata?.media?.original_media_url || DEFAULT_NO_IMAGE}
          style={{ display: loaded ? 'block' : 'none' }}
          onLoad={onLoad}
        />
        {!loaded && <Skeleton className={styles.skeleton} />}
        <div className={styles['make-collateral-wrap']}>
          <button onClick={() => handle(item)}>{text}</button>
        </div>
      </div>
      <div className={styles.collection}>{item.metadata.collection || item.collectionName || item.metadata.name}</div>
      <div className={styles.name}>{item.metadata.name || `${item.collectionSymbol} #${item.tokenId}`}</div>
      <div className={styles.extension}>
        <span>ERC-721</span>
      </div>
    </div>
  );
}
