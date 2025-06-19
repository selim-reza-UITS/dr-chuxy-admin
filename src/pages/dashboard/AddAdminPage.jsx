import { useState } from "react"
import { Trash2, X, Eye, EyeOff } from 'lucide-react'
import { useAddAdminMutation, useGetAdminsQuery, useDeleteAdminMutation } from "../../features/admin/adminSlice"
import toast from "react-hot-toast"

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h3>
        <p className="text-sm text-gray-600 mb-6">Do you want to delete this admin? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// Add Admin Modal Component
const AddAdminModal = ({ isOpen, onClose, onSubmit, email, setEmail, password, setPassword, emailError, setEmailError, isSubmitting }) => {
  const [showPassword, setShowPassword] = useState(false)

  if (!isOpen) return null

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setEmailError("")

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    if (!password) {
      setEmailError("Password cannot be empty")
      return
    }

    onSubmit(e)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Add New Admin</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter admin email"
              disabled={isSubmitting}
            />
            {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
          </div>
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 pr-10"
                placeholder="Enter admin password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : null}
            {isSubmitting ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </div>
    </div>
  )
}

const AddAdminPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // RTK Query hooks
  const { data: admins = [], isLoading: isLoadingAdmins, error: adminsError, refetch } = useGetAdminsQuery()
  const [addAdmin, { isLoading: isAddingAdmin }] = useAddAdminMutation()
  const [deleteAdmin, { isLoading: isDeletingAdmin }] = useDeleteAdminMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check for duplicate email
    if (admins.some((admin) => admin.email === email)) {
      setEmailError("This email is already registered as an admin")
      return
    }

    try {
      const result = await addAdmin({ email, password }).unwrap()
      toast.success("Admin added successfully!")
      setEmail("")
      setPassword("")
      setShowAddModal(false)
      setEmailError("")
      refetch() // Refresh the admin list
    } catch (error) {
      console.error("Error adding admin:", error)
      toast.error(error.data?.message || "Failed to add admin. Please try again.")
      setEmailError(error.data?.message || "Failed to add admin. Please try again.")
    }
  }

  const handleDelete = (admin) => {
    setSelectedAdmin(admin)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (selectedAdmin) {
      try {
        await deleteAdmin(selectedAdmin.email).unwrap()
        toast.success("Admin deleted successfully!")
        setShowDeleteModal(false)
        setSelectedAdmin(null)
        refetch() // Refresh the admin list
      } catch (error) {
        console.error("Failed to delete admin:", error)
        toast.error(error.data?.message || "Failed to delete admin. Please try again.")
      }
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoadingAdmins) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    )
  }

  if (adminsError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading admins: {adminsError.data?.message || adminsError.message}</p>
          <button 
            onClick={refetch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Admin
        </button>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider mr-2">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.email} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{admin.username}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{admin.email}</td>
                <td className="px-6 py-4 text-sm">
                  {admin.is_superuser && (
                    <span className=" inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                      Superuser
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(admin.date_joined)}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(admin)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isDeletingAdmin}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-600">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setEmail("")
          setPassword("")
          setEmailError("")
        }}
        onSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        emailError={emailError}
        setEmailError={setEmailError}
        isSubmitting={isAddingAdmin}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeletingAdmin}
      />
    </div>
  )
}

export default AddAdminPage