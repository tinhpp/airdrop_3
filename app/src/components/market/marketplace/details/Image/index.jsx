/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react';
import styles from '../styles.module.scss';
import bnbTokenIcon from '@src/assets/bnb-token.svg';
import { useImageLoaded } from '@src/hooks/useImageLoaded';
import { Skeleton } from 'antd';
import { DEFAULT_NO_IMAGE } from '@src/constants';

export default function Image({ marketItem }) {
  const [ref, loaded, onLoad] = useImageLoaded();

  return (
    <div className={styles.image}>
      <div className={styles['image-heading']}>
        <img src={bnbTokenIcon} alt="BNB" />
        <Icon icon="mdi:heart-outline" fontSize={24} />
      </div>
      <img
        ref={ref}
        src={marketItem.metadata?.image || marketItem.metadata?.media?.original_media_url || DEFAULT_NO_IMAGE}
        style={{ display: loaded ? 'block' : 'none' }}
        className={styles['item-image']}
        onLoad={onLoad}
      />
      {!loaded && <Skeleton.Image className={styles.skeleton} />}
    </div>
  );
}
