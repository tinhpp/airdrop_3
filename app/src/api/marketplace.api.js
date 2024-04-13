import axios from '@src/config/axios.conf';

export const getMarketItems = (params = {}) => {
  return axios.get('/market-items', {
    params,
  });
};

export const listItem = (data) => {
  return axios.post('/market-items', data);
};

export const updateItem = (id, data) => {
  return axios.patch('/market-items/' + id, data);
};

export const getMarketItemById = (id, params = {}) => {
  return axios.get('/market-items/' + id, {
    params,
  });
};

export const getAuctionItems = (params = {}) => {
  return axios.get('/auction-items', {
    params,
  });
};

export const listAuctionItem = (data) => {
  return axios.post('/auction-items', data);
};

export const updateAuctionItem = (id, data) => {
  return axios.patch('/auction-items/' + id, data);
};

export const getAuctionItemById = (id, params = {}) => {
  return axios.get('/auction-items/' + id, {
    params,
  });
};
