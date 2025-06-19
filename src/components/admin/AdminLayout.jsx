import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext.jsx";
import { FileText, Upload, FileIcon, History } from "lucide-react";

const AdminLayout = () => {
  const { isAuthenticated, admin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path) => {
    return (
      location.pathname === path ||
      (path !== "/admin" && location.pathname.startsWith(path))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </div>

       

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin/questions"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive("/admin") || isActive("/admin/questions")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FileText className="h-5 w-5 mr-3" />
                Questions
              </Link>
            </li>
            <li>
              <Link
                to="/admin/upload"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive("/admin/upload")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Upload className="h-5 w-5 mr-3" />
                Upload Documents
              </Link>
            </li>
            <li>
              <Link
                to="/admin/pdf-list"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive("/admin/pdf-list")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FileIcon className="h-5 w-5 mr-3" />
                PDF list
              </Link>
            </li>
            <li>
              <Link
                to="/admin/history"
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive("/admin/history")
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <History className="h-5 w-5 mr-3" />
                User History
              </Link>
            </li>
          </ul>
        </nav>

        
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-end">
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-700">
              {admin?.name}
            </span>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {admin?.avatar ? (
                <img
                  src={admin.avatar || "/placeholder.svg"}
                  alt={admin.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-gray-700">
                  {admin?.name?.charAt(0) || "A"}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
