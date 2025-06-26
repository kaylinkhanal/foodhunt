import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
    };

const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
    },
  },
});

export const { setProducts, addProduct } = productSlice.actions;

export default productSlice.reducer;
