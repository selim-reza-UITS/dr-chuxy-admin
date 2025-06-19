import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the base query with the API base URL and token handling
const baseQuery = fetchBaseQuery({
  baseUrl: "http://api.smarthealthnow.io/api/v1",
  prepareHeaders: (headers, { getState }) => {
    // Retrieve token from Redux state
    const token = getState().auth?.token || null;

    // If token exists, set the Authorization header
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Create the API slice with the base query
export const apiSlice = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  tagTypes: ["user", "Chats"],
  endpoints: () => ({}),
});