"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  useDeleteUserResponseMutation,
  useGetUserHistoryQuery,
} from "../../features/admin/adminSlice";

const UserHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;

  // API hooks
  const {
    data: userHistory = [],
    isLoading,
    error,
    refetch,
  } = useGetUserHistoryQuery();
  const [deleteUserResponse, { isLoading: isDeleting }] =
    useDeleteUserResponseMutation();

  // Filter history based on search term
  const filteredHistory = userHistory.filter((item) => {
    const userName =
      item.user_responses?.find((r) =>
        r.question.toLowerCase().includes("name")
      )?.response_text || "";
    const userEmail = item.user?.email || "";
    const searchLower = searchTerm.toLowerCase();

    return (
      userName.toLowerCase().includes(searchLower) ||
      userEmail.toLowerCase().includes(searchLower) ||
      item.user?.username?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (
      window.confirm("Are you sure you want to delete this user's response?")
    ) {
      try {
        await deleteUserResponse(userId).unwrap();
        alert("User response deleted successfully");
      } catch (error) {
        console.error("Error deleting user response:", error);
        alert("Failed to delete user response");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserName = (userResponses) => {
    const nameResponse = userResponses?.find((r) =>
      r.question.toLowerCase().includes("name")
    );
    return nameResponse?.response_text || "Unknown User";
  };

  const getFirstQuestion = (userResponses) => {
    if (!userResponses || userResponses.length === 0) return "No responses";
    return userResponses[0]?.question || "No question";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading user history...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">Failed to load user history</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-medium text-gray-500">User</h2>
          <h2 className="text-sm font-medium text-gray-500">History</h2>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for something"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                History
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No user history found
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                const userName = getUserName(item.user_responses);
                const firstQuestion = getFirstQuestion(item.user_responses);

                return (
                  <tr key={item.user?.id || Math.random()}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {item.user_responses?.length || 0} responses
                      {item.ai_response && (
                        <div className="text-xs text-green-600 mt-1">
                          AI recommendations generated
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.created_on)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="text-gray-600 hover:text-gray-900 mx-1"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.user?.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 mx-1 disabled:opacity-50"
                        title="Delete Response"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
          <div>
            Showing data {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredHistory.length)} of{" "}
            {filteredHistory.length} entries
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${
                currentPage === 1
                  ? "text-gray-400"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }

              return (
                <button
                  key={index}
                  onClick={() => paginate(pageNum)}
                  className={`h-8 w-8 flex items-center justify-center rounded-md ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2">...</span>
                <button
                  onClick={() => paginate(totalPages)}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-200"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modal for viewing user details */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Response Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">User Information</h4>
                <p>
                  <strong>Name:</strong>{" "}
                  {getUserName(selectedUser.user_responses)}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.user?.email}
                </p>
                <p>
                  <strong>Username:</strong> {selectedUser.user?.username}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.user?.role}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(selectedUser.created_on)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Survey Responses</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedUser.user_responses?.map((response, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2">
                      <p className="font-medium text-sm">{response.question}</p>
                      <p className="text-gray-600 text-sm">
                        {response.response_text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedUser.ai_response && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">AI Recommendations</h4>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {selectedUser.ai_response}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHistory;
