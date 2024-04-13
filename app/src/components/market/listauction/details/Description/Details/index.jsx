/* eslint-disable react/prop-types */
import { sliceAddress } from '@src/utils';
import styles from '../../styles.module.scss';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { marketPlaceContract } from '@src/utils';
import { useEffect, useState } from 'react';

const MUMBAI_SCAN = import.meta.env.VITE_MUMBAI_SCAN;

export default function Details({ marketItem }) {
  const [commissionFee, setCommissionFee] = useState(0);

  const fetchCommissionFee = async () => {
    try {
      const [royaltyFee, hundredPercent] = await Promise.all([
        marketPlaceContract().royaltyPercent(),
        marketPlaceContract().HUNDRED_PERCENT(),
      ]);
      setCommissionFee((royaltyFee * 100) / hundredPercent);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchCommissionFee();
  }, []);

  return (
    <div className={styles.details}>
      <div className={styles['detail-item']}>
        <div className={styles['detail-item-label']}>Contract Address</div>
        <div className={styles['detail-item-value']}>
          <Link to={`${MUMBAI_SCAN}/address/marketItem.nftAddress`} target="_blank">
            {sliceAddress(marketItem.nftAddress)}
          </Link>
        </div>
      </div>
      <div className={styles['detail-item']}>
        <div className={styles['detail-item-label']}>Token ID</div>
        <div className={styles['detail-item-value']}>{marketItem.nftId}</div>
      </div>
      <div className={styles['detail-item']}>
        <div className={styles['detail-item-label']}>Token Standard</div>
        <div className={styles['detail-item-value']}>ERC-721</div>
      </div>
      <div className={styles['detail-item']}>
        <div className={styles['detail-item-label']}>Chain</div>
        <div className={styles['detail-item-value']}>Mumbai Testnet</div>
      </div>
      <div className={styles['detail-item']}>
        <div className={styles['detail-item-label']}>Last Updated</div>
        <div className={styles['detail-item-value']}>{moment(marketItem.updatedAt).fromNow()}</div>
      </div>
      <div className={styles['detail-item']}>
        <div className={styles['detail-item-label']}>Commission Fee</div>
        <div className={styles['detail-item-value']}>{commissionFee}%</div>
      </div>
    </div>
  );
}
