import Information from './Information';
import Image from './Image';
import styles from './styles.module.scss';
import Action from './Action';
import Activity from './Activity';
import ReactLoading from 'react-loading';
import { useEffect, useState } from 'react';
import { getMarketItemById } from '@src/api/marketplace.api';
import { useParams, useNavigate } from 'react-router-dom';
import { MarketItemStatus } from '@src/constants';
import Description from './Description';
import Recommendation from './Recommendation';

export default function MarketItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [marketItem, setMarketItem] = useState();

  const fetchMarketItems = async () => {
    try {
      const { data } = await getMarketItemById(id, {
        status: MarketItemStatus.OPENING,
      });
      setMarketItem(data);
      setIsLoading(false);
      window.scrollTo(0, 0);
    } catch (error) {
      if (error?.response?.status === 404) {
        navigate('/marketplace/nfts');
      }
    }
  };

  useEffect(() => {
    fetchMarketItems();
  }, [id]);

  if (isLoading)
    return (
      <div className="react-loading-item" style={{ marginTop: '100px' }}>
        <ReactLoading type="bars" color="#fff" height={100} width={120} />
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles['details-wrap']}>
        <div className={styles.left}>
          <Image marketItem={marketItem} />
          <Description marketItem={marketItem} />
        </div>
        <div className={styles.right}>
          <Information marketItem={marketItem} />
          <Action marketItem={marketItem} />
          <Activity marketItem={marketItem} title={'Item Activity'} />
        </div>
      </div>
      <Recommendation marketItem={marketItem} />
    </div>
  );
}
