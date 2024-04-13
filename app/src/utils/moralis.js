import axios from 'axios';
import { CHAIN_ID } from '@src/constants';

const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API_KEY;
const MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2.2';

const headers = {
  accept: 'application/json',
  'X-API-Key': MORALIS_API_KEY,
};

export const getNFTsOfOwner = async (owner, params = {}, chainId = CHAIN_ID) => {
  const url = `${MORALIS_API_URL}/${owner}/nft`;
  const options = {
    method: 'GET',
    url,
    params: {
      chain: '0x' + Number(chainId).toString(16),
      media_items: true,
      format: 'decimal',
      ...params,
    },
    headers,
  };

  const { data } = await axios.request(options);
  return data.result;
};

export const getERC20OfOwner = async (owner, chainId = CHAIN_ID) => {
  const url = `${MORALIS_API_URL}/${owner}/erc20`;
  const options = {
    method: 'GET',
    url,
    params: {
      chain: '0x' + Number(chainId).toString(16),
      format: 'decimal',
    },
    headers,
  };

  const { data } = await axios.request(options);
  return data;
};

export const getNftMetadata = async (collectionAddress, id, chainId = CHAIN_ID) => {
  const url = `${MORALIS_API_URL}/nft/${collectionAddress}/${id}`;
  const options = {
    method: 'GET',
    url,
    params: {
      chain: '0x' + Number(chainId).toString(16),
      format: 'decimal',
      media_items: true,
    },
    headers,
  };

  const { data } = await axios.request(options);
  return data;
};

export const getMintTransactionOfNft = async (collectionAddress, id, chainId = CHAIN_ID) => {
  // /nft/0x7fbac9d3b38375be3cd3ecf9701f4bd3349dd392/2/transfers
  const url = `${MORALIS_API_URL}/nft/${collectionAddress}/${id}/transfers`;
  const options = {
    method: 'GET',
    url,
    params: {
      chain: '0x' + Number(chainId).toString(16),
      format: 'decimal',
    },
    headers,
  };

  const { data } = await axios.request(options);
  return data.result[data.result.length - 1];
};
