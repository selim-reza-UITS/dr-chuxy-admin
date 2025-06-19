import { apiSlice } from "../api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create admin
    addAdmin: builder.mutation({
      query: (adminData) => ({
        url: "/admin/add/user/",
        method: "POST",
        body: {
          email: adminData.email,
          password: adminData.password,
        },
      }),
      invalidatesTags: ["Admin"],
    }),

    // Get all admins
    getAdmins: builder.query({
      query: () => ({
        url: "/admin/add/user/",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    // Get all user responses/history
    getUserHistory: builder.query({
      query: () => ({
        url: "/admin/user/ans/api/",
        method: "GET",
      }),
      providesTags: ["UserHistory"],
    }),

    // Delete a user response
    deleteUserResponse: builder.mutation({
      query: (userId) => ({
        url: `/admin/user/ans/api/?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserHistory"],
    }),


    // Delete admin
    deleteAdmin: builder.mutation({
      query: (email) => ({
        url: "/admin/add/user/",
        method: "DELETE",
        body: {
          email: email,
        },
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useAddAdminMutation,
  useGetAdminsQuery,
  useDeleteAdminMutation,
  useGetUserHistoryQuery,
  useDeleteUserResponseMutation,
} = adminApi;