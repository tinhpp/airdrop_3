/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react';
import { addToCart as addToCartApi, deleteAllOfMarketItem, deleteFromCart } from '@src/api/cart.api';
import { addToCart, removeFromCart } from '@src/redux/features/cartSlice';
import {
  calculateDiffTime,
  getBNBPrice,
  isMarketItemInSale,
  parseMetamaskError,
  upperCaseFirstLetter
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

  const isInSale = isMarketItemInSale(marketItem);

  const handleBuyNow = async () => {
    try {
      setCommitLoading(true);
      const marketItemPrice = isInSale ? marketItem.salePrice : marketItem.price;
      const tx = await marketplaceContractWrite('purchaseItems', [[marketItem.onChainId]], ethers.utils.parseEther(marketItemPrice));

      await tx.wait();
      await deleteAllOfMarketItem(marketItem.id);
      toast.success('Buy NFT successfully');
      setCommitLoading(false);
    } catch (error) {
      console.log(error);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setCommitLoading(false);
    }
  };

  const handleActionCart = async () => {
    try {
      setCommitLoading(true);
      const cart = Object.values(carts).find((item) => item.marketItem.id === marketItem.id);
      if (cart) {
        const cartId = cart.id;
        await deleteFromCart(cartId);
        dispatch(removeFromCart(cartId));
        toast.success('Remove cart successfully');
      } else {
        const { data } = await addToCartApi({
          owner: account.address,
          marketItem: marketItem.id,
        });
        dispatch(addToCart({ [data.id]: data }));
        toast.success('Add to cart successfully');
      }
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
        const result = calculateDiffTime(marketItem.timeSaleEnd * 1000, new Date().getTime());
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
            Sale ends {moment(marketItem.timeSaleEnd * 1000).format('MMMM Do YYYY, h:mm:ss A')}
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
        <div className={styles.label}>Current Price</div>
        <div className={`${styles.price}  ${isInSale ? styles['unused-price'] : ''}`}>
          <span>
            {marketItem.price} {account.currency}
          </span>
          <span>$ {(marketItem.price * bnbPrice).toFixed(2)}</span>
        </div>
        {isInSale && (
          <div className={`${styles.price} ${styles['sale-price']}`}>
            <span>
              {marketItem.salePrice} {account.currency}
            </span>
            <span>$ {(marketItem.salePrice * bnbPrice).toFixed(2)}</span>
          </div>
        )}

        <div className={styles['action-button-wrap']}>
          <button onClick={handleBuyNow} disabled={account.address.toLowerCase() === marketItem.owner.toLowerCase()}>
            <Icon icon="icon-park-outline:buy" fontSize={24} />
            <span>Buy now</span>
          </button>
          <button
            onClick={handleActionCart}
            disabled={account.address.toLowerCase() === marketItem.owner.toLowerCase()}
          >
            {Object.values(carts).find((item) => item.marketItem.id === marketItem.id) ? (
              <Icon icon="pepicons-pop:cart-off" fontSize={24} />
            ) : (
              <Icon icon="mdi:cart-outline" fontSize={24} />
            )}

            <span>
              {Object.values(carts).find((item) => item.marketItem.id === marketItem.id) ? 'Remove from' : 'Add to'}{' '}
              cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
