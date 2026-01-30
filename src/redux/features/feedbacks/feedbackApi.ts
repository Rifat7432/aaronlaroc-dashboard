import { baseApi } from "../../services/API";

const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateStatusOfFeedback: builder.mutation({
      query: (id) => {
        return {
          url: `reports/${id}`,
          method: "PUT",
          body: { status: "Completed" },
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

export const { useUpdateStatusOfFeedbackMutation, useGetAllFeedbackQuery } = feedbackApi;
