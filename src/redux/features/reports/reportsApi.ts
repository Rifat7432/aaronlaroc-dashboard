import { baseApi } from "../../services/API";

const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => {
        return {
          url: "adminlogin",
          method: "POST",
          body: user,
        };
      },
      invalidatesTags: ["Auth", "User"],
    }),
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
  }),
});

export const { useLoginMutation, useGetAllReportsQuery,useGetSystemReportsQuery } = reportApi;
