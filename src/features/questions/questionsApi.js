import { apiSlice } from "../api/apiSlice";

export const questionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all questions
    getQuestions: builder.query({
      query: () => ({
        url: "/admin/questions/api/",
        method: "GET",
      }),
      providesTags: ["Questions"],
    }),
    
    // Add a new question
    addQuestion: builder.mutation({
      query: (questionData) => ({
        url: "/admin/questions/api/",
        method: "POST",
        body: {
          question: questionData.question,
          type: questionData.type,
          placeholder: questionData.placeholder,
          // Only include options for select type
          ...(questionData.type === "select" && { options: questionData.options }),
        },
      }),
      invalidatesTags: ["Questions"],
    }),
    
    // Update an existing question
    updateQuestion: builder.mutation({
      query: (questionData) => ({
        url: `/admin/questions/api/?id=${questionData.id}`,
        method: "PATCH",
        body: {
          question: questionData.question,
          type: questionData.type,
          placeholder: questionData.placeholder,
          // Only include options for select type
          ...(questionData.type === "select" && { options: questionData.options }),
        },
      }),
      invalidatesTags: ["Questions"],
    }),
    
    // Delete a question
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/admin/questions/api/?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questions"],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionsApi;