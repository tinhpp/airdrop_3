import axios from '@src/config/axios.conf';

export const getCarts = (params) => {
  return axios.get('/carts', {
    params,
  });
};

export const addToCart = (data) => {
  return axios.post('/carts', data);
};

export const deleteFromCart = (cartId) => {
  return axios.delete('/carts/' + cartId);
};

export const deleteAllOfOwner = (owner) => {
  return axios.delete('/carts/owner/' + owner);
};

export const deleteAllOfMarketItem = (marketItem) => {
  return axios.delete('/carts/market-item', {
    params: {
      marketItem,
    },
  });
};
