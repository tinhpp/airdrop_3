/* eslint-disable react/prop-types */
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

export default function HeaderBanner({ title = '', description = '', tabs = [], right = true }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const account = useSelector((state) => state.account);

  const handleNavigate = async (url) => {
    try {
      navigate(url);
    } catch (error) {
      toast.error('An error has been occurred!', {
        duration: 3000,
        style: {
          fontWeight: 600,
        },
      });
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.left}>
          <h1>{title}</h1>
          <div className={styles.description}>{description}</div>
        </div>
        {right && (
          <div className={styles.right}>
            <div>
              <div className={styles['right-item']}>
                <div className={styles['right-item-left']}>Balance:</div>
                <div>
                  {account.balance} {account.currency}
                </div>
              </div>
              <div className={styles['right-item']}>
                <div className={styles['right-item-left']}>Borrow:</div>
                <div>0</div>
              </div>
              <div className={styles['right-item']}>
                <div className={styles['right-item-left']}>Lend:</div>
                <div>0</div>
              </div>
            </div>
          </div>
        )}
      </div>
      {tabs.length > 0 && (
        <div className={styles.tabs}>
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`${styles['tab-item']} ${pathname === tab.url ? styles.active : ''}`}
              onClick={() => handleNavigate(tab.url)}
            >
              {tab.text}
            </div>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
}
