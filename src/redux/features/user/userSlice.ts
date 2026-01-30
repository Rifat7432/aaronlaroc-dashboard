import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TUser = {
  name: string;
  role: string;
  email: string;
  image?: string;
};
type TValue = {
  user: TUser | null;
  decodeUser: { email: string; userId: string } | null;

  loading: boolean;
  collapsed: boolean;
  dashboardData: {
    users: number;
    newUsers: number;
    totalReports: number;
    newUsersPercent: number;
    currentMonthUsers: number;
    activeUsersPercent: number;
    inactiveUsers: number;
    inactiveUsersPercent: number;
  };
};
const initialState: TValue = {
  user: null,
  loading: false,
  decodeUser: null,

  collapsed: false,
  dashboardData: {
    users: 0,
    newUsers: 0,
    totalReports: 0,
    newUsersPercent: 0,
    currentMonthUsers: 0,
    activeUsersPercent: 0,
    inactiveUsers: 0,
    inactiveUsersPercent: 0,
  },
};
// product slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    storDashboardData: (
      state,
      actions: PayloadAction<{
        users: number;
        newUsers: number;
        totalReports: number;
        newUsersPercent: number;
        currentMonthUsers: number;
        activeUsersPercent: number;
        inactiveUsers: number;
        inactiveUsersPercent: number;
      }>,
    ) => {
      state.dashboardData = actions.payload;
    },
    storUserData: (state, actions: PayloadAction<TUser>) => {
      state.user = actions.payload;
    },
    storDecodeUser: (
      state,
      actions: PayloadAction<{ email: string; userId: string }>,
    ) => {
      state.decodeUser = actions.payload;
    },

    setLoading: (state, actions: PayloadAction<boolean>) => {
      state.loading = actions.payload;
    },
    isCollapsed: (state, actions) => {
      state.collapsed = actions.payload;
    },
  },
});
export const {
  storUserData,
  setLoading,
  storDecodeUser,
  isCollapsed,
  storDashboardData,
} = userSlice.actions;
export default userSlice.reducer;
