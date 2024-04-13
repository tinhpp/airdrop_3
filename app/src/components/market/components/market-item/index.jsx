/* eslint-disable react/prop-types */
import { Icon } from '@iconify/react';
import { addToCart as addToCartApi, deleteAllOfMarketItem, deleteFromCart } from '@src/api/cart.api';
import { DEFAULT_NO_IMAGE } from '@src/constants';
import { useImageLoaded } from '@src/hooks/useImageLoaded';
import { addToCart, removeFromCart } from '@src/redux/features/cartSlice';
import { isMarketItemInSale, parseMetamaskError } from '@src/utils';
import { write as marketplaceContractWrite } from '@src/utils/contracts/marketplace';
import { ethers } from 'ethers';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ReactLoading from 'react-loading';
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.scss';

export default function MarketItem({ item, editable, marketItemInCarts = {}, action: { text, handle }, style = {} }) {
  const dispatch = useDispatch();

  const [ref, loaded, onLoad] = useImageLoaded();
  const account = useSelector((state) => state.account);

  const [commitLoading, setCommitLoading] = useState(false);

  const handleBuyNow = async (marketItem) => {
    try {
      setCommitLoading(true);
      const marketItemPrice = isMarketItemInSale(marketItem) ? marketItem.salePrice : marketItem.price;
      const price = ethers.utils.parseEther(marketItemPrice);

      const tx = await marketplaceContractWrite('purchaseItems', [[marketItem.onChainId]], price);

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

  const handleActionCart = async (item, isInCart) => {
    try {
      setCommitLoading(true);
      if (isInCart) {
        const cartId = Object.keys(marketItemInCarts).find((cart) => marketItemInCarts[cart] === item.id);
        await deleteFromCart(cartId);
        dispatch(removeFromCart(cartId));
        toast.success('Remove cart successfully');
      } else {
        const { data } = await addToCartApi({
          owner: account.address,
          marketItem: item.id,
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

  return (
    <div className={styles.card} style={style}>
      {commitLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
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
          {editable && editable.text && <button onClick={() => editable.handle(item)}>{editable.text}</button>}
        </div>
      </div>
      <div className={styles['info-wrap']}>
        <div className={styles.name}>
          <span>{item.metadata.collection || item.collectionName || item.metadata.name}</span>
          <span className={styles['token-id']}>#{item?.metadata?.token_id}</span>
        </div>
        <div className={styles.price}>
          {isMarketItemInSale(item) ? (
            <>
              <span className={styles['text-through']}>{item.price}</span>
              <span>{item.salePrice}</span>
            </>
          ) : (
            <span>{item.price || `Current: ${item?.highestBidder ? item.highestBidder.amount : item?.initPrice}`}</span>
          )}{' '}
          {account.currency}
        </div>
      </div>
      <div className={styles['buy-btn-wrap']}>
        <button
          className={styles['buy-btn']}
          disabled={account.address.toLowerCase() === item.owner.toLowerCase()}
          onClick={() => handleBuyNow(item)}
        >
          Buy now
        </button>
        <button
          className={styles['cart-btn']}
          disabled={account.address.toLowerCase() === item.owner.toLowerCase()}
          onClick={() => handleActionCart(item, Object.values(marketItemInCarts).includes(item.id))}
        >
          {Object.values(marketItemInCarts).includes(item.id) ? (
            <Icon icon="pepicons-pop:cart-off" fontSize={24} />
          ) : (
            <Icon icon="mdi:cart-outline" fontSize={24} />
          )}
        </button>
      </div>
    </div>
  );
}
