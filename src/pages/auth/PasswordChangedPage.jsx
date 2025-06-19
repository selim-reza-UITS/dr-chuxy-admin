import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PasswordChangedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-green-500" />
        </div>

        <h1 className="auth-title">Password Changed</h1>
        <p className="text-gray-600 mb-6">Your password has been changed successfully</p>

        <button onClick={() => navigate("/login")} className="auth-button">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default PasswordChangedPage;