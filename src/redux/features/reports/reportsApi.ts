import { baseApi } from "../../services/API";

const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReports: builder.query({
      query: () => {
        return {
          url: "all-reports",
          method: "GET",
        };
      },
      providesTags: ["Reports"],
    }),
    getSystemReports: builder.query({
      query: () => {
        return {
          url: "performance",
          method: "GET",
        };
      },
      providesTags: ["Reports"],
    }),
    getMonthlyEarningsStats: builder.query({
      query: () => {
        return {
          url: "monthly-earnings-stats",
          method: "GET",
        };
      },
      providesTags: ["Reports"],
    }),
    getMonthlyEarningsAnalytics: builder.query({
      query: () => {
        return {
          url: "subscriptions/stats",
          method: "GET",
        };
      },
      providesTags: ["Reports"],
    }),
  }),
});

export const {  useGetMonthlyEarningsStatsQuery,useGetAllReportsQuery,useGetSystemReportsQuery,useGetMonthlyEarningsAnalyticsQuery } = reportApi;
