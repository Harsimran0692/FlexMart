import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../feature/cart/counterSlice";
import cartReducer from "../feature/cart/cartSlice"; // Import the new cart reducer
import userLoginReducer from "../feature/cart/loginUserSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
    loginUser: userLoginReducer,
  },
});
