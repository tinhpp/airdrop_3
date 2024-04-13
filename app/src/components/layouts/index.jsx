import { CHAIN_ID, RPC_URL } from '@src/constants';
import { setAccount } from '@src/redux/features/accountSlice';
import { setCarts } from '@src/redux/features/cartSlice';
import { getCarts } from '@src/api/cart.api';
import { getNativeBalance } from '@src/utils';
import { Layout } from 'antd';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import ConnectMetamask from './connect-metamask';
import AppFooter from './footer';
import Navbar from './header';
import { convertArrayToObject } from '@src/utils';

const { Content } = Layout;

export default function UserLayout() {
  const account = useSelector((state) => state.account);
  const [network, setNetwork] = useState(window.ethereum.networkVersion);

  const dispatch = useDispatch();

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else {
      if (network == CHAIN_ID) {
        const balance = await getNativeBalance(accounts[0]);
        dispatch(
          setAccount({
            address: accounts[0].toLowerCase(),
            balance: balance,
            currency: 'MATIC',
          })
        );
      }
    }
  };

  const requireSwitchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                rpcUrl: RPC_URL,
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  };

  const fetchCarts = async () => {
    const { data } = await getCarts({ owner: account.address });
    dispatch(setCarts(convertArrayToObject(data)));
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
          console.error(err);
        });

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('networkChanged', function (networkId) {
        setNetwork(networkId);
      });
      requireSwitchNetwork();

      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      provider.getNetwork().then(({ chainId }) => setNetwork(chainId));
    } else {
      alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.ethereum]);

  useEffect(() => {
    // fetchCarts();
  }, [account.address]);

  return (
    <Layout style={{ background: '#16152d', minHeight: '100vh' }}>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 2500 }} />
      <Navbar handleAccountsChanged={handleAccountsChanged} requireSwitchNetwork={requireSwitchNetwork} />
      <Content>
        <div className="container">
          {account.address && network == CHAIN_ID ? (
            <Outlet />
          ) : (
            <ConnectMetamask
              handleAccountsChanged={handleAccountsChanged}
              requireSwitchNetwork={requireSwitchNetwork}
            />
          )}
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
}
