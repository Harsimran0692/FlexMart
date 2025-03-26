import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      items: [],
      totalItems: 0,
    },
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload; // Update cart with response from API
    },
    clearCart: (state) => {
      state.cart = {
        items: [],
        totalItems: 0,
      };
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
