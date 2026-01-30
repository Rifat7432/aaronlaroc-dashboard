import { baseApi } from "../../services/API";

const feedbackApi = baseApi.injectEndpoints({
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
    getAllFeedback: builder.query({
      query: () => {
        return {
          url: "all-reviews",
          method: "GET",
        };
      },
      providesTags: ["Feedback"],
    }),
  }),
});

export const { useLoginMutation, useGetAllFeedbackQuery } = feedbackApi;
