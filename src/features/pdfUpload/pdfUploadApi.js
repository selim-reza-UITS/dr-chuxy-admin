import { apiSlice } from "../api/apiSlice";

export const pdfUploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadPdf: builder.mutation({
      query: (formData) => ({
        url: "/pdf/",
        method: "POST",
        body: formData,
        // Ensure headers are not set manually for FormData
        // RTK Query will handle this automatically
      }),
      invalidatesTags: ["pdf"],
    }),
    getPdfList: builder.query({
      query: () => ({
        url: "/pdf/",
        method: "GET",
      }),
      providesTags: ["pdf"],
    }),
  }),
});

export const { useUploadPdfMutation, useGetPdfListQuery } = pdfUploadApi;