/* eslint-disable react/prop-types */
import { getMarketItems } from '@src/api/marketplace.api';
import { MarketItemStatus, MarketItemStatusToText } from '@src/constants';
import { getMintTransactionOfNft, sliceAddress } from '@src/utils';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from '../styles.module.scss';

const MUMBAI_SCAN = import.meta.env.VITE_MUMBAI_SCAN;

export default function Activity({ title, marketItem }) {
  const account = useSelector((state) => state.account);

  const [activityData, setActivityData] = useState([]);
  const [mintTransaction, setMintTransaction] = useState();

  const fetchData = async () => {
    try {
      const [res1, res2] = await Promise.all([
        getMarketItems({
          nftId: marketItem.nftId,
          nftAddress: marketItem.nftAddress,
        }),
        getMintTransactionOfNft(marketItem.nftAddress, marketItem.nftId),
      ]);
      setActivityData(res1.data.nfts);
      setMintTransaction(res2);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.activity}>
      <div className={styles.heading}>{title}</div>
      <div className={styles['table-list-item-header']}>
        <div className={styles['table-list']}>
          <div className={`${styles['table-list-item']} font-bold`}>Event</div>
          <div className={`${styles['table-list-item']} font-bold`}>Price</div>
          <div className={`${styles['table-list-item']} font-bold`}>From</div>
          <div className={`${styles['table-list-item']} font-bold`}>To</div>
          <div className={`${styles['table-list-item']} font-bold`}>Date</div>
        </div>
      </div>
      <div className={styles['table-list-item-body']}>
        {activityData &&
          activityData.length > 0 &&
          activityData.map((item, index) => (
            <div key={index}>
              {item.status !== MarketItemStatus.OPENING && (
                <div className={styles['table-list']}>
                  <div className={`${styles['table-list-item']} font-bold`}>{MarketItemStatusToText[item.status]}</div>
                  <div className={styles['table-list-item']}>
                    {item.price} {account.currency}
                  </div>
                  <div className={styles['table-list-item']}>
                    <Link to={`${MUMBAI_SCAN}/address/${item.owner}`} target="_blank">
                      {sliceAddress(item.owner)}
                    </Link>
                  </div>
                  <div className={styles['table-list-item']}>
                    {item.buyer ? (
                      <Link to={`${MUMBAI_SCAN}/address/${item.buyer}`} target="_blank">
                        {sliceAddress(item.buyer)}
                      </Link>
                    ) : (
                      'Null Address'
                    )}
                  </div>
                  <div className={styles['table-list-item']}>
                    {moment(item.createdAt).tz('Asia/Ho_Chi_Minh').fromNow()}
                  </div>
                </div>
              )}
              <div className={styles['table-list']}>
                <div className={`${styles['table-list-item']} font-bold`}>
                  {MarketItemStatusToText[MarketItemStatus.OPENING]}
                </div>
                <div className={styles['table-list-item']}>
                  {item.price} {account.currency}
                </div>
                <div className={styles['table-list-item']}>
                  <Link to={`${MUMBAI_SCAN}/address/${item.owner}`} target="_blank">
                    {sliceAddress(item.owner)}
                  </Link>
                </div>
                <div className={styles['table-list-item']}>
                  {item.buyer ? (
                    <Link to={`${MUMBAI_SCAN}/address/${item.buyer}`} target="_blank">
                      {sliceAddress(item.buyer)}
                    </Link>
                  ) : (
                    'Null Address'
                  )}
                </div>
                <div className={styles['table-list-item']}>
                  {moment(item.createdAt).tz('Asia/Ho_Chi_Minh').fromNow()}
                </div>
              </div>
            </div>
          ))}
        {mintTransaction && (
          <div className={styles['table-list']}>
            <div className={`${styles['table-list-item']} font-bold`}>Mint</div>
            <div className={styles['table-list-item']}>0 {account.currency}</div>
            <div className={styles['table-list-item']}>Null Address</div>
            <div className={styles['table-list-item']}>
              <Link to={`${MUMBAI_SCAN}/address/${mintTransaction.to_address}`} target="_blank">
                {sliceAddress(mintTransaction.to_address)}
              </Link>
            </div>
            <div className={styles['table-list-item']}>
              {moment(mintTransaction.block_timestamp).tz('Asia/Ho_Chi_Minh').fromNow()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
