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
    forgetPassword: builder.mutation({
      query: (emailData) => {
        return {
          url: "auth/dashboard/forget-password",
          method: "POST",
          body: emailData,
        };
      },
      invalidatesTags: ["getUser"],
    }),
    resendOTP: builder.mutation({
      query: (user) => {
        return {
          url: "auth/resend-otp",
          method: "POST",
          body: user,
        };
      },
      invalidatesTags: ["getUser"],
    }),
    resetPassword: builder.mutation({
      query: (updatedData) => {
        return {
          url: `auth/dashboard/reset-password`,
          method: "POST",
          body: updatedData,
        };
      },
      invalidatesTags: ["getUser"],
    }),
    changePassword: builder.mutation({
      query: (authData) => {
        return {
          url: "auth/change-password",
          method: "POST",
          body: authData,
        };
      },
      invalidatesTags: ["getUser"],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgetPasswordMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
