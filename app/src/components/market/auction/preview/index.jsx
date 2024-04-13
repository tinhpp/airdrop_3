/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { CHAIN_ID, DEFAULT_NO_IMAGE, MARKETPLACE_ADDRESS } from '@src/constants';
import { approveERC721, checkApproved, getNftMetadata, parseMetamaskError } from '@src/utils';
import ReactLoading from 'react-loading';
import styles from '../styles.module.scss';
import { useSelector } from 'react-redux';
import { write as marketplaceContractWrite } from '@src/utils/contracts/marketplace';
import { listAuctionItem, listItem } from '@src/api/marketplace.api';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';

export default function PreviewMarketItem({ marketItem, handleRefresh }) {
  const account = useSelector((state) => state.account);
  const [metadata, setMetadata] = useState({});
  const [marketItemParams, setMarketItemParams] = useState({
    price: 0,
    timeStart: 0,
    timeEnd: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [commitLoading, setCommitLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNftMetadata = async () => {
    try {
      setIsLoading(true);
      setError('');
      setMarketItemParams({
        price: 0,
        timeStart: 0,
        timeEnd: 0,
      });
      if (marketItem.address && marketItem.id) {
        const nftMetadata = await getNftMetadata(marketItem.address, marketItem.id, CHAIN_ID);
        setMetadata(nftMetadata);
      } else {
        setMetadata({});
      }
      setIsLoading(false);
    } catch (error) {
      if (error?.response.status === 404) {
        setError('Invalid NFT');
      }
      setIsLoading(false);
    }
  };

  const handleMarketItemParamsChange = (e) => {
    setMarketItemParams({
      ...marketItemParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSellNft = async () => {
    try {
      if (!marketItem.id || !marketItem.address) {
        console.log('marketItem', marketItem);
        return;
      }

      setCommitLoading(true);
      if (!(await checkApproved(marketItem.id, MARKETPLACE_ADDRESS, marketItem.address))) {
        const tx = await approveERC721(marketItem.id, MARKETPLACE_ADDRESS, marketItem.address);
        await tx.wait();
      }

      await listAuctionItem({
        nftId: marketItem.id,
        nftAddress: marketItem.address,
        metadata,
        owner: account.address,
        initPrice: marketItemParams.price,
        timeStart: new Date(marketItemParams.timeStart).getTime() / 1000,
        timeEnd: new Date(marketItemParams.timeEnd).getTime() / 1000,
      });

      const tx = await marketplaceContractWrite('listAuctionItem', [
        {
          nft: marketItem.address,
          tokenId: marketItem.id,
          initPrice: ethers.utils.parseUnits(marketItemParams.price, 18),
          timeStart: new Date(marketItemParams.timeStart).getTime() / 1000,
          timeEnd: new Date(marketItemParams.timeEnd).getTime() / 1000,
          feeReceiver: account.address,
        },
      ]);

      await tx.wait();

      toast.success('List Auction NFT successfully. Please waiting for confirmation');
      handleRefresh();
      setCommitLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setCommitLoading(false);
    }
  };

  const isDisabledSellButton = () => {
    return (
      Object.values(marketItemParams).includes('0') ||
      Object.values(marketItemParams).includes(0) ||
      Object.values(marketItemParams).includes('')
    );
  };

  useEffect(() => {
    fetchNftMetadata();
  }, [marketItem]);

  return (
    <>
      {commitLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <div className={styles['preview-left']}>
        {isLoading ? (
          <div className="react-loading-item mb-60">
            <ReactLoading type="bars" color="#fff" height={100} width={120} />
          </div>
        ) : (
          <img src={metadata?.media?.original_media_url || DEFAULT_NO_IMAGE} />
        )}
      </div>
      <div className={styles['preview-right']}>
        {metadata?.name && !error && <div className={styles.name}>Item: {`${metadata.name} #${marketItem.id}`}</div>}
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles['input-wrap']}>
          <div className={styles['input-label']}>Init Price: </div>
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
          <div className={styles['input-control']}></div>
        </div>

        <div className={styles['preview-sale']}>
          <div className={styles['input-wrap']}>
            <div className={styles['input-label']}>Start time: </div>
            <div className={styles['input-control']}>
              <input
                type="datetime-local"
                name="timeStart"
                value={marketItemParams.timeStart}
                onChange={handleMarketItemParamsChange}
              />
            </div>
          </div>
          <div className={styles['input-wrap']}>
            <div className={styles['input-label']}>Time end: </div>
            <div className={styles['input-control']}>
              <input
                type="datetime-local"
                name="timeEnd"
                value={marketItemParams.timeEnd}
                onChange={handleMarketItemParamsChange}
              />
            </div>
          </div>
        </div>

        <button disabled={isDisabledSellButton()} onClick={handleSellNft}>
          List Auction NFT
        </button>
      </div>
    </>
  );
}
