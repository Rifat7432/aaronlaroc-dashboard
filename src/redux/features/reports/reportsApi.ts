import { baseApi } from "../../services/API";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => {
        return {
          url: "adminlogin",
          method: "POST",
          body: user,
        };
      },
      invalidatesTags: ["getUser"],
    }),
    getAllReports: builder.query({
      query: () => {
        return {
          url: "all-reports",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLoginMutation, useGetAllReportsQuery } = authApi;
