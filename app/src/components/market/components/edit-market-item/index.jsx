/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import { useOnClickOutside } from 'usehooks-ts';
import { write as marketplaceContractWrite } from '@src/utils/contracts/marketplace';

import styles from './styles.module.scss';
import { DEFAULT_NO_IMAGE } from '@src/constants';
import { useSelector } from 'react-redux';
import { convertSecondsToRFC3339Time, parseMetamaskError } from '@src/utils';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export default function EditMarketItem({ item, onClose }) {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(false);
  const [marketItemParams, setMarketItemParams] = useState({
    price: item.price,
    timeSaleStart: item.timeSaleStart == 0 ? 0 : convertSecondsToRFC3339Time(item.timeSaleStart),
    timeSaleEnd: item.timeSaleEnd == 0 ? 0 : convertSecondsToRFC3339Time(item.timeSaleEnd),
    salePrice: item.salePrice,
  });
  const [isSale, setIsSale] = useState(Number(item.timeSaleStart) > 0);
  const [error, setError] = useState('');

  const handleMarketItemParamsChange = (e) => {
    setMarketItemParams({
      ...marketItemParams,
      [e.target.name]: e.target.value,
    });

    validateMarketItemParams({
      ...marketItemParams,
      [e.target.name]: e.target.value,
    });
  };

  const validateMarketItemParams = (params) => {
    let paramsError = '';
    if (isSale) {
      if (params.timeSaleStart >= params.timeSaleEnd) {
        paramsError = 'Time sale end must be after time sale start!';
      } else if (params.salePrice <= 0 || params.salePrice >= params.price) {
        paramsError = 'Sale price must be greater than 0 and less than price!';
      } else {
        paramsError = '';
      }
    } else {
      if (params.price == 0) {
        paramsError = 'Price must be greater than 0!';
      } else {
        paramsError = '';
      }
    }

    setError(paramsError);
    return paramsError;
  };

  const handleEditMarketItem = async () => {
    try {
      if (validateMarketItemParams(marketItemParams)) return;

      setIsLoading(true);
      const tx = await marketplaceContractWrite('updateItem', [
        item.onChainId,
        ethers.utils.parseUnits(marketItemParams.price, 18),
        new Date(marketItemParams.timeSaleStart).getTime() / 1000,
        new Date(marketItemParams.timeSaleEnd).getTime() / 1000,
        marketItemParams.salePrice == 0 ? 0 : ethers.utils.parseUnits(marketItemParams.salePrice, 18),
      ]);

      await tx.wait();

      setIsLoading(false);
      setIsSale(false);
      onClose();
      toast.success('Update market item successfully');
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
    }
  };

  const isDisabledSellButton = () => {
    if (!isSale) {
      return marketItemParams.price == 0 || !marketItemParams.price || error !== '';
    }
    return (
      Object.values(marketItemParams).includes('0') || Object.values(marketItemParams).includes('') || error !== ''
    );
  };

  const ref = useRef(null);

  useOnClickOutside(ref, () => {
    document.body.style.overflow = 'unset';
    onClose();
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <div className={styles.form} ref={ref}>
        <div className={styles.left}>
          <div className={styles['item-name']}>
            {item.metadata.collection || item.collectionName || item.metadata.name} #{item?.metadata?.token_id}
          </div>
          <img src={item.metadata?.media?.original_media_url || DEFAULT_NO_IMAGE} />
        </div>
        <div className={styles.right}>
          <div>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles['input-wrap']}>
              <div className={styles['input-label']}>Price: </div>
              <div className={styles['input-control']}>
                <input
                  type="number"
                  placeholder="Price: e.g. 5"
                  name="price"
                  value={marketItemParams.price}
                  onChange={handleMarketItemParamsChange}
                />
                <span>{account.currency}</span>
              </div>
            </div>
            <div className={styles['input-wrap']}>
              <div className={styles['input-label']}></div>
              <div className={styles['input-control']}>
                <label>
                  <input type="checkbox" name="price" checked={isSale} onChange={() => setIsSale(!isSale)} />
                  <span>Sale program</span>
                </label>
              </div>
            </div>
            {isSale && (
              <>
                <div className={styles['input-wrap']}>
                  <div className={styles['input-label']}>Sale from: </div>
                  <div className={styles['input-control']}>
                    <input
                      type="datetime-local"
                      name="timeSaleStart"
                      value={marketItemParams.timeSaleStart}
                      onChange={handleMarketItemParamsChange}
                    />
                  </div>
                </div>
                <div className={styles['input-wrap']}>
                  <div className={styles['input-label']}>Sale to: </div>
                  <div className={styles['input-control']}>
                    <input
                      type="datetime-local"
                      name="timeSaleEnd"
                      value={marketItemParams.timeSaleEnd}
                      onChange={handleMarketItemParamsChange}
                    />
                  </div>
                </div>
                <div className={styles['input-wrap']}>
                  <div className={styles['input-label']}>Sale Price: </div>
                  <div className={styles['input-control']}>
                    <input
                      type="number"
                      placeholder="Sale Price: e.g. 5"
                      name="salePrice"
                      value={marketItemParams.salePrice}
                      onChange={handleMarketItemParamsChange}
                    />
                    <span>{account.currency}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles['button-wrap']}>
            <button onClick={onClose}>Cancel</button>
            <button disabled={isDisabledSellButton()} onClick={handleEditMarketItem}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
