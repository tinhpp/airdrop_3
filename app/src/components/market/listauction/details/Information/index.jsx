/* eslint-disable react/prop-types */
import { sliceAddress } from '@src/utils';
import styles from '../styles.module.scss';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import SocialShare from './SocialShare';
import { useState } from 'react';

const MUMBAI_SCAN = import.meta.env.VITE_MUMBAI_SCAN;

export default function Information({ marketItem }) {
  const [isOpenSocialShare, setIsOpenSocialShare] = useState(false);

  return (
    <div className={styles.information}>
      {isOpenSocialShare && <SocialShare onClose={() => setIsOpenSocialShare(false)} />}
      <div className={styles.name}>
        {marketItem.metadata.collection || marketItem.collectionName || marketItem.metadata.name} #{marketItem.nftId}
      </div>
      <div className={styles.owner}>
        Owned by{' '}
        <Link to={`${MUMBAI_SCAN}/address/${marketItem.owner}`} target="_blank">
          {sliceAddress(marketItem.owner)}
        </Link>
      </div>
      <div className={styles['more-information']}>
        <div className={styles['information-token-id']}># {marketItem.nftId}</div>
        <div className={styles['information-item']}>
          <Icon icon="carbon:view" fontSize={20} />
          <span>104 views</span>
        </div>
        <div className={styles['information-item']}>
          <Icon icon="mdi:heart-outline" fontSize={20} />
          <span>3 favorites</span>
        </div>
        <button className={styles['information-item']} onClick={() => setIsOpenSocialShare(true)}>
          <Icon icon="ri:share-line" fontSize={20} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
