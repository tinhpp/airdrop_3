import { Icon } from '@iconify/react';
import { getNFTsOfOwner } from '@src/utils';
import Card from '@src/components/common/card';
import { Pagination } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import styles from './styles.module.scss';

export default function ListItem({ onClose, onClick }) {
  const account = useSelector((state) => state.account);

  const ref = useRef(null);

  useOnClickOutside(ref, () => onClose());

  const [isLoading, setIsLoading] = useState(false);
  const [allNfts, setAllNfts] = useState([]);
  const [listNFT, setListNFT] = useState({
    nfts: [],
    total: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const fetchNFTs = async () => {
    if (currentPage === 0) return;
    try {
      setIsLoading(true);
      const data = await getNFTsOfOwner(account.address);
      setAllNfts(data);
      setListNFT({
        total: data.length,
        nfts: data.slice(0, 5).map((item) => ({ ...item, metadata: JSON.parse(item.metadata) })),
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  const handleOnChangePage = (page) => {
    setCurrentPage(page);
    setListNFT({
      ...listNFT,
      nfts: allNfts
        .slice((page - 1) * 5, Number(page) * 5)
        .map((item) => ({ ...item, metadata: JSON.parse(item.metadata) })),
    });
  };

  const handleClickItem = (item) => {
    onClick({ address: item.token_address, id: item.token_id });
    onClose();
  };

  useEffect(() => {
    fetchNFTs();
  }, [account.address]);

  return (
    <div className={styles.container}>
      <div className={styles['list-item']} ref={ref}>
        <div className={styles.heading}>
          <span>Choose NFT from your collection</span>
          <Icon icon="material-symbols:close" className={styles['close-btn']} onClick={onClose} />
        </div>
        {isLoading ? (
          <div className="react-loading-item">
            <ReactLoading type="bars" color="#fff" height={100} width={120} />
          </div>
        ) : listNFT.nfts.length > 0 ? (
          <>
            <div className={styles['list-nfts']}>
              {listNFT.nfts.map((item) => (
                <Card
                  key={item.id}
                  item={item}
                  action={{
                    text: 'Choose NFT',
                    handle: () => handleClickItem(item),
                  }}
                />
              ))}
            </div>
            <div className={styles['paginate-nfts']}>
              <Pagination
                defaultCurrent={currentPage}
                pageSize={5}
                onChange={handleOnChangePage}
                total={listNFT.total}
              />
            </div>
          </>
        ) : (
          <div className={styles['no-data']}>
            <span>No data</span>
          </div>
        )}
      </div>
    </div>
  );
}
