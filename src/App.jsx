import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./features/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import OTPVerificationPage from "./pages/auth/OTPVerificationPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import PasswordChangedPage from "./pages/auth/PasswordChangedPage";
import DashboardLayout from "./components/layouts/DashboardLayout";
import QuestionsPage from "./pages/dashboard/QuestionsPage";
import UploadDocumentsPage from "./pages/dashboard/UploadDocumentsPage";
import PDFListPage from "./pages/dashboard/PDFListPage";
import UserHistoryPage from "./pages/dashboard/UserHistoryPage";
import "./App.css";
import AddAdminPage from "./pages/dashboard/AddAdminPage";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/otp-verification" element={<OTPVerificationPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/password-changed" element={<PasswordChangedPage />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<QuestionsPage />} />
          <Route path="/upload-documents" element={<UploadDocumentsPage />} />
          <Route path="/pdf-list" element={<PDFListPage />} />
          <Route path="/user-history" element={<UserHistoryPage />} />
          <Route path="/add-admin" element={<AddAdminPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
