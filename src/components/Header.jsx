
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Health Assessment Tool
        </Link>
        <div>
          <Link to="/admin/login" className="text-sm text-gray-600 hover:text-gray-800">
            Admin Login
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
