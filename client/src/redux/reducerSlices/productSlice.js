import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  aggregatedCart: []
    };

const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
      const productId = action.payload._id;
      debugger;
      const existingProduct = state.aggregatedCart.find(item => item._id === productId);
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      }
      else {
        state.aggregatedCart.push({
          ...action.payload,
          quantity: action.payload.quantity || 1, // Default to 1 if quantity is not provided
        });
      }

    },
    removeFromCart: (state, action) => {
    
    },
  },
});

export const { addToCart, removeFromCart } = productSlice.actions;

export default productSlice.reducer;
