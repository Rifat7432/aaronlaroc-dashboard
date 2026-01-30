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
      invalidatesTags: ["Auth", "User"],
    }),
    forgetPassword: builder.mutation({
      query: (emailData) => {
        return {
          url: "AdminEmail",
          method: "POST",
          body: emailData,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    verifyOTP: builder.mutation({
      query: (user) => {
        return {
          url: "codeverify",
          method: "POST",
          body: user,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    resetPassword: builder.mutation({
      query: (updatedData) => {
        return {
          url: `forgetPassword`,
          method: "POST",
          body: updatedData,
        };
      },
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOTPMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,

} = authApi;
