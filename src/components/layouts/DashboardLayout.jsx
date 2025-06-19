import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Upload, FileIcon, History } from "lucide-react";
import { IoIosLogOut } from "react-icons/io";
import { MdAdminPanelSettings } from "react-icons/md";
import { logout, selectUser } from "../../features/auth/authSlice";
const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar relative">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Dashboard</h1>
        </div>

        <div
          onClick={handleLogout}
          className="absolute bottom-10 left-10 flex items-center gap-2 flex-row-reverse text-red-600 cursor-pointer"
        >
          <h1 className="text-base">Logout </h1>
          <IoIosLogOut />
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <FileText className="sidebar-nav-icon" size={20} />
            Question
          </NavLink>
          <NavLink
            to="/upload-documents"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Upload className="sidebar-nav-icon" size={20} />
            Upload Documents
          </NavLink>
          <NavLink
            to="/pdf-list"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <FileIcon className="sidebar-nav-icon" size={20} />
            Uploaded PDF list
          </NavLink>
          <NavLink
            to="/user-history"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <History className="sidebar-nav-icon" size={20} />
            User History
          </NavLink>
          <NavLink
            to="/add-admin"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
          >
            <MdAdminPanelSettings className="sidebar-nav-icon" size={20} />
            Add Admin
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <p>{user?.email}</p>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
