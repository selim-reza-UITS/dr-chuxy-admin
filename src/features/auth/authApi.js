import { apiSlice } from "../api/apiSlice"

// Extend the API slice with authentication and password reset endpoints
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login mutation (existing)
    login: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["user"],
    }),

    // Google Social Login
    googleLogin: builder.mutation({
      query: (userData) => ({
        url: "/admin/social/login/",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["user"],
    }),

    // Forgot Password OTP Send
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/admin/password/reset/request/",
        method: "POST",
        body: { email },
      }),
    }),

    // OTP Verification
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/admin/password/reset/verify/",
        method: "POST",
        body: { email, otp },
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ email, otp, password }) => ({
        url: "/admin/password/reset/confirm/",
        method: "POST",
        body: { email, otp, password },
      }),
    }),
  }),
})

// Export the generated hooks
export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi
