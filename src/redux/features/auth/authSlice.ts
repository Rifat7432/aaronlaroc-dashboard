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
};

const initialState: TInitialState = {
  user: null,
  token: null,
  collapsed: false,
  loading: false,
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
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("accessToken");
    },
  },
});
export const { storToken, storUserData, setLoading, isCollapsed, logOut } =
  authSlice.actions;
export default authSlice.reducer;
