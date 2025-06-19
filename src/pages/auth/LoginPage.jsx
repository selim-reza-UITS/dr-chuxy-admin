"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "../../features/auth/authApi";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import app from "../../components/Firebase/firebase";
import Swal from "sweetalert2";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  // Handle form submission and login API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Make the API call to login
      const response = await loginUser({
        email,
        password,
        rememberMe,
      }).unwrap();

      // Dispatch the login action with the token and user data
      dispatch(
        login({
          token: response.access,
          user: {
            name: response.user?.name || response.user?.username || "Admin",
            email: email,
            avatar: response.user?.avatar || null,
            id: response.user?.id,
            role: response.user?.role || "admin",
          },
        })
      );

      // Show success message
      Swal.fire({
        title: "Login Successful!",
        text: "Welcome back to the admin panel",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Navigate to the dashboard on successful login
      navigate("/");
    } catch (err) {
      console.log(err);
      // Handle errors from the API
      setError(err.data?.error || "Invalid email or password");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsGoogleLoading(true);
    setError(null);

    try {
      // Firebase Google Sign In
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Login successful, user:", user);

      // Prepare user data for backend
      const userData = {
        email: user.email,
        name: user.displayName,
        profileImage: user.photoURL,
        uid: user.uid,
        provider: "google",
      };

      // Send user data to backend
      const response = await googleLogin(userData).unwrap();

      console.log("Backend Google login response:", response);

      // Dispatch login action with backend response
      dispatch(
        login({
          token: response.access,
          user: {
            name:
              response.user?.name ||
              response.user?.username ||
              user.displayName,
            email: user.email,
            avatar: user.photoURL,
            id: response.user?.id,
            role: response.user?.role || "admin",
            provider: "google",
          },
        })
      );

      // Show success message
      Swal.fire({
        title: "Google Login Successful!",
        text: `Welcome ${user.displayName}!`,
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Navigate to dashboard
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);

      let errorMessage =
        error.data?.error || "Failed to login with Google. Please try again.";

      // Handle specific error cases
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelled by user.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }

      setError(errorMessage);

      // Show error with SweetAlert2
      Swal.fire({
        title: "Login Failed",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="auth-title">Admin Login</h1>
          <p className="text-gray-600 text-sm mt-2">
            Sign in to access the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="auth-label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isGoogleLoading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="auth-input pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isGoogleLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isGoogleLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading || isGoogleLoading}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="auth-button flex items-center justify-center"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              type="button"
              className="flex items-center justify-center w-full border border-gray-300 rounded-md py-3 px-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Signing in with Google...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
