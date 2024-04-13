/* eslint-disable react/prop-types */
import styles from '../styles.module.scss';
import { Collapse } from 'antd';
import Traits from './Traits';
import Details from './Details';

export default function Description({ marketItem }) {
  const metadata = marketItem.metadata?.metadata ? JSON.parse(marketItem.metadata?.metadata) : {};
  const items = [
    {
      key: '1',
      label: 'Description',
      children: <div>{metadata.description || `${marketItem.metadata.symbol} #${marketItem.nftId}`}</div>,
      style: {
        backgroundColor: '#221e37',
      },
    },
    {
      key: '2',
      label: 'Traits',
      children: <Traits attributes={metadata.attributes} />,
      style: {
        backgroundColor: '#221e37',
      },
    },
    {
      key: '3',
      label: 'Details',
      children: <Details marketItem={marketItem} />,
      style: {
        backgroundColor: '#221e37',
      },
    },
  ];

  return (
    <div className={styles.description}>
      <Collapse style={{ border: '0px solid rgba(146, 108, 227, 0.3)' }} items={items} />
    </div>
  );
}
