import { createSlice } from "@reduxjs/toolkit";


export type TUser = {
  id: string;
  email: string;
  role: string;
};

type TInitialState = {
  user: TUser | null;
  token: string | null;
  collapsed: boolean;
  loading: boolean;
  otpEmail?: string | null;
  otp?: string | null;
};

const initialState: TInitialState = {
  user: null,
  token: null,
  collapsed: false,
  loading: false,
  otpEmail: null,
  otp: null,
};
// authentication slice
export const authSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    storUserData: (state, actions) => {
      state.user = actions.payload;
    },
    storToken: (state, actions) => {
      state.token = actions.payload;
    },
    setLoading: (state, actions) => {
      state.loading = actions.payload;
    },
    isCollapsed: (state, actions) => {
      state.collapsed = actions.payload;
    },
    setOtpEmail: (state, actions) => {
      state.otpEmail = actions.payload;
    },
    setOTP: (state, actions) => {
      state.otp = actions.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("accessToken");
    },
  },
});
export const {
  storToken,
  storUserData,
  setLoading,
  isCollapsed,
  logOut,
  setOtpEmail,
  setOTP,
} = authSlice.actions;
export default authSlice.reducer;
