import { baseApi } from "../../services/API";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => {
        return {
          url: "users/profile",
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id: string) => {
        return {
          url: `users/user/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => {
        return {
          url: `deleteUser/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `adminUpdateUser/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    blockUser: builder.mutation({
      query: (id: string) => {
        return {
          url: `users/block/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Users"],
    }),
    getAllUsers: builder.query({
      query: (query) => {
        return {
          url: "pagenationlist",
          method: "GET",
          params: query,
        };
      },
      providesTags: ["Users"],
    }),
    getAdminUserAnalysis: builder.query({
      query: (query) => {
        return {
          url: "users/analysis",
          method: "GET",
          params: query,
        };
      },
      providesTags: ["Users"],
    }),
    getAdminUserStats: builder.query({
      query: () => {
        return {
          url: "counts-user-report",
          method: "GET",
        };
      },
      providesTags: ["Users"],
    }),
    emailUser: builder.mutation({
      query: (email) => {
        return {
          url: "email",
          method: "POST",
          body: email,
        };
      },
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useEmailUserMutation,
  useGetAllUsersQuery,
  useBlockUserMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGetAdminUserAnalysisQuery,
  useGetAdminUserStatsQuery,
  useUpdateUserMutation,
} = userApi;
