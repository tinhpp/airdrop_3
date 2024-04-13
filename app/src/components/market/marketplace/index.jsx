/* eslint-disable react-hooks/exhaustive-deps */
import { getMarketItems } from '@src/api/marketplace.api';
import { MarketItemStatus } from '@src/constants';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MarketItem from '../components/market-item';
import styles from './styles.module.scss';

export default function Assets() {
  let [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const account = useSelector((state) => state.account);
  const carts = useSelector((state) => state.cart.items);

  const marketItemInCarts = Object.values(carts).reduce((pre, cur) => ({ ...pre, [cur.id]: cur.marketItem.id }), {});

  const [isLoading, setIsLoading] = useState(true);
  const [listNFT, setListNFT] = useState({
    nfts: [],
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleOnChangePage = (page) => {
    setCurrentPage(page);
    setSearchParams({
      page,
    });
  };

  const fetchNFTs = async () => {
    if (currentPage === 0) return;
    try {
      const { data } = await getMarketItems({
        page: currentPage,
        status: MarketItemStatus.OPENING,
      });
      setListNFT(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchNFTs();
    setCurrentPage(searchParams.get('page') || 1);
  }, [account.address, currentPage, searchParams]);

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <span>All assets</span>
        {/* <div className={styles['button-group']}>
          <input placeholder='Search by name' />
        </div> */}
      </div>
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : listNFT.nfts.length > 0 ? (
        <>
          <div className={styles['list-nfts']}>
            {listNFT.nfts.map((item) => (
              <MarketItem
                key={item.id}
                item={item}
                marketItemInCarts={marketItemInCarts}
                action={{ text: 'View details', handle: () => navigate(`/marketplace/assets/${item.id}`) }}
              />
            ))}
          </div>
          <div className={styles['paginate-nfts']}>
            <Pagination defaultCurrent={currentPage} onChange={handleOnChangePage} total={listNFT.total} />
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
