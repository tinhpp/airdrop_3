/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react';
import { addToCart as addToCartApi, deleteAllOfMarketItem, deleteFromCart } from '@src/api/cart.api';
import { addToCart, removeFromCart } from '@src/redux/features/cartSlice';
import {
  calculateDiffTime,
  getBNBPrice,
  isAuctionItemInSale,
  parseMetamaskError,
  upperCaseFirstLetter,
} from '@src/utils';
import { write as marketplaceContractWrite } from '@src/utils/contracts/marketplace';
import { ethers } from 'ethers';
import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactLoading from 'react-loading';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles.module.scss';

export default function Action({ marketItem }) {
  const dispatch = useDispatch();

  const account = useSelector((state) => state.account);
  const carts = useSelector((state) => state.cart.items);

  const [commitLoading, setCommitLoading] = useState(false);
  const [bnbPrice, setBNBPrice] = useState(0);
  const [countdownTime, setCountdownTime] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
  const [bidPrice, setBidPrice] = useState(0);

  const isInSale = isAuctionItemInSale(marketItem);

  const handleBuyNow = async () => {
    try {
      setCommitLoading(true);
      const tx = await marketplaceContractWrite(
        'bidItem',
        [marketItem.onChainId],
        ethers.utils.parseEther(`${bidPrice}`)
      );

      await tx.wait();
      toast.success('Bid NFT successfully');
      setCommitLoading(false);
    } catch (error) {
      console.log(error);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setCommitLoading(false);
    }
  };

  const handleDistributeAuctionItem = async () => {
    try {
      setCommitLoading(true);
      const tx = await marketplaceContractWrite('distributeAuctionItem', [marketItem.onChainId]);

      await tx.wait();
      toast.success('Distribute NFT to bidder successfully');
      setCommitLoading(false);
    } catch (error) {
      console.log(error);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setCommitLoading(false);
    }
  };

  const handleCancelAuction = async () => {
    try {
      setCommitLoading(true);
      const tx = await marketplaceContractWrite('closeAuctionItem', [marketItem.onChainId]);

      await tx.wait();
      toast.success('Close auction successfully');
      setCommitLoading(false);
    } catch (error) {
      console.log(error);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setCommitLoading(false);
    }
  };

  useEffect(() => {
    getBNBPrice().then(setBNBPrice);

    if (isInSale) {
      setInterval(() => {
        const result = calculateDiffTime(marketItem.timeEnd * 1000, new Date().getTime());
        setCountdownTime(result);
      }, 1000);
    }
  }, []);

  return (
    <div className={styles.action}>
      {commitLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      {isInSale && (
        <div className={styles.sale}>
          <div className={styles['sale-time']}>
            Auction ends {moment(marketItem.timeEnd * 1000).format('MMMM Do YYYY, h:mm:ss A')}
          </div>
          <div className={styles['sale-countdown']}>
            {Object.keys(countdownTime).map((key, index) => (
              <div className={styles['sale-countdown-item']} key={index}>
                <span>{countdownTime[key]}</span>
                <span>{upperCaseFirstLetter(key)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles['action-main']}>
        <div className={styles.label}>Highest bid amount</div>
        <div className={`${styles.price} `}>
          <span>
            {marketItem.highestBidder ? marketItem.highestBidder.amount : marketItem.initPrice} {account.currency}
          </span>
          <span>
            ${' '}
            {((marketItem.highestBidder ? marketItem.highestBidder.amount : marketItem.initPrice) * bnbPrice).toFixed(
              2
            )}
          </span>
        </div>
        <div className={styles['action-button-wrap']}>
          {isInSale ? (
            <>
              <input
                placeholder="Input your amount"
                type="number"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
              />
              <button onClick={handleBuyNow}>
                <Icon icon="icon-park-outline:buy" fontSize={24} />
                <span>Bid for this item</span>
              </button>
            </>
          ) : (
            <button onClick={handleDistributeAuctionItem}>
              <Icon icon="icon-park-outline:buy" fontSize={24} />
              <span>Distribute auction item to bidder</span>{' '}
            </button>
          )}
          {!marketItem.highestBidder && (
            <button onClick={handleCancelAuction}>
              <Icon icon="icon-park-outline:buy" fontSize={24} />
              <span>Cancel auction</span>{' '}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
