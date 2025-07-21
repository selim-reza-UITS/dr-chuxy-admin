import { apiSlice } from "../api/apiSlice"

export const pdfUploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadPdf: builder.mutation({
      query: (formData) => ({
        url: "/pdf/",
        method: "POST",
        body: formData,
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
    deletePdfByPmid: builder.mutation({
      query: (pmid) => ({
        url: `/pdf/delete-by-pmid/${pmid}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["pdf"],
    }),
  }),
})

export const { useUploadPdfMutation, useGetPdfListQuery, useDeletePdfByPmidMutation } = pdfUploadApi
