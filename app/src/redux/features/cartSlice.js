import { createSelector, createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  isError: false,
  items: {},
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCarts: (state, action) => {
      state.items = action.payload;
    },
    addToCart: (state, action) => {
      state.items = { ...state.items, ...action.payload };
    },
    removeFromCart: (state, action) => {
      console.log('action.payload', action.payload);
      delete state.items[action.payload];
    },
    clearAllCart: (state) => {
      state.items = {};
    },
  },
});

export const selectIsItemInCart = createSelector(
  [(state) => state.cart.items, (state, item) => item],
  (items, search) => items.find((item) => item.hash === search.hash)
);

export const selectTotalPrice = createSelector(
  (state) => state.cart.items,
  (items) =>
    Object.values(items).reduce((acc, cur) => {
      if (cur.marketItem.timeSaleStart) {
        const currentTime = new Date().getTime() / 1000;
        if (Number(cur.marketItem.timeSaleStart) <= currentTime && currentTime <= cur.marketItem.timeSaleEnd) {
          return acc + +cur.marketItem.salePrice;
        }
      }
      return acc + +cur.marketItem.price;
    }, 0)
);

export const { setCarts, addToCart, removeFromCart, clearAllCart } = cartSlice.actions;
export default cartSlice.reducer;
