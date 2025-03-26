import { createSlice } from "@reduxjs/toolkit";

const loginUserSlice = createSlice({
  name: "loginUser",
  initialState: {
    value: "Hello, SignIn",
  },
  reducers: {
    setLoginUser: (state, action) => {
      console.log("reducer..");

      state.value = action.payload;
    },
  },
});

export const { setLoginUser } = loginUserSlice.actions;
export default loginUserSlice.reducer;
