import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { sliceAddress } from '@src/utils';
import ListItem from './list-item';
import PreviewMarketItem from './preview';
import bnbTokenIcon from '@src/assets/bnb-token.svg';
import styles from './styles.module.scss';

const MarketplaceAuctionNft = () => {
  const account = useSelector((state) => state.account);

  const [marketItem, setMarketItem] = useState({
    address: '',
    id: '',
  });
  const [isOpenListItem, setIsOpenListItem] = useState(false);

  const handleChange = (e) => {
    setMarketItem({ ...marketItem, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setMarketItem({
      address: '',
      id: '',
    });
  }, [account]);

  return (
    <div className={styles.container}>
      {isOpenListItem && <ListItem onClose={() => setIsOpenListItem(false)} onClick={setMarketItem} />}
      <div className={styles.left}>
        <div className={styles.badge}>
          <img src={bnbTokenIcon} alt="BNB Token Icon" />
          <div className={styles['badge-info']}>
            <div>{sliceAddress(account.address)}</div>
            <div>Mumbai Testnet</div>
          </div>
        </div>
        <div className={styles['input-wrap']}>
          <div className={styles.input}>
            <div>
              <span>*</span> Token address
            </div>
            <input
              placeholder="e.g: 0x00000000000000000000000"
              name="address"
              value={marketItem.address}
              onChange={handleChange}
            />
          </div>
          <div className={styles.input}>
            <div>
              <span>*</span> Token ID
            </div>
            <input type="number" placeholder="e.g: 1" name="id" value={marketItem.id} onChange={handleChange} />
          </div>
          <div className={styles['import-btn-wrap']}>
            <button className={styles['import-btn']} onClick={() => setIsOpenListItem(true)}>
              Choose from your collection
            </button>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <PreviewMarketItem
          marketItem={marketItem}
          handleRefresh={() =>
            setMarketItem({
              address: '',
              id: '',
            })
          }
        />
      </div>
    </div>
  );
};

export default MarketplaceAuctionNft;
