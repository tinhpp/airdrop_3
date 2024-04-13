/* eslint-disable react-hooks/exhaustive-deps */
import { getMarketItems } from '@src/api/marketplace.api';
import { MarketItemStatus } from '@src/constants';
import { parseMetamaskError } from '@src/utils';
import { write as marketplaceContractWrite } from '@src/utils/contracts/marketplace';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import MarketItem from '../components/market-item';
import styles from './styles.module.scss';
import { updateItem } from '@src/api/marketplace.api';
import EditMarketItem from '../components/edit-market-item';

export default function SellingNfts() {
  let [searchParams, setSearchParams] = useSearchParams();

  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(true);
  const [listNFT, setListNFT] = useState({
    nfts: [],
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [commitLoading, setCommitLoading] = useState(false);
  const [editItem, setEditItem] = useState();

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
        owner: account.address,
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

  const handleCloseMarketItem = async (marketItem) => {
    try {
      setCommitLoading(true);
      const tx = await marketplaceContractWrite('closeItem', [marketItem.onChainId]);
      await tx.wait();
      await updateItem(marketItem.id, { status: MarketItemStatus.CLOSED });
      toast.success('Recall NFT successfully');
      fetchNFTs();
      setCommitLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setCommitLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
    setCurrentPage(searchParams.get('page') || 1);
  }, [account.address, currentPage, searchParams]);

  return (
    <div className={styles.container}>
      {editItem && <EditMarketItem item={editItem} onClose={() => setEditItem()} />}
      {commitLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
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
                action={{ text: 'Recall NFT', handle: handleCloseMarketItem }}
                editable={{ text: 'Edit', handle: () => setEditItem(item) }}
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
