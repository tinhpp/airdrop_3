/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import styles from '../styles.module.scss';
import { getMarketItems } from '@src/api/marketplace.api';
import MarketItem from '@src/components/market/components/market-item';
import { useSelector } from 'react-redux';
import { Pagination } from 'antd';
import { MarketItemStatus } from '@src/constants';
import { useNavigate } from 'react-router-dom';

export default function Recommendation({ marketItem }) {
  const navigate = useNavigate();
  const carts = useSelector((state) => state.cart.items);

  const [marketItems, setMarketItems] = useState({
    nfts: [],
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const marketItemInCarts = Object.values(carts).reduce((pre, cur) => ({ ...pre, [cur.id]: cur.marketItem.id }), {});
  const fetchMarketItems = async () => {
    try {
      const { data } = await getMarketItems({
        page: currentPage,
        nftAddress: marketItem.nftAddress,
        status: MarketItemStatus.OPENING,
      });
      setMarketItems(data);
    } catch (error) {
      console.log('[RECOMMENDATION ERROR]:', error);
    }
  };

  useEffect(() => {
    fetchMarketItems();
  }, []);

  return (
    <div className={styles.recommendation}>
      <div className={styles['recommendation-heading']}>More From This Collection</div>
      {marketItems.nfts.length > 0 ? (
        <>
          <div className={styles['list-nfts']}>
            {marketItems.nfts.map((item) => (
              <MarketItem
                key={item.id}
                item={item}
                marketItemInCarts={marketItemInCarts}
                action={{ text: 'View details', handle: () => navigate(`/marketplace/assets/${item.id}`) }}
                style={{ border: '1px solid rgba(146, 108, 227, 0.3)', boxShadow: 'unset', borderRadius: '12px' }}
              />
            ))}
          </div>
          <div className={styles['paginate-nfts']}>
            <Pagination
              defaultCurrent={currentPage}
              onChange={(page) => setCurrentPage(page)}
              total={marketItems.total}
            />
          </div>
        </>
      ) : (
        <div className={styles['no-data']}>
          <span>No data</span>
        </div>
      )}
    </div>
  );
}
