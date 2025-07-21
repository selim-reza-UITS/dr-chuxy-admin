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
  User,
  MessageSquare,
  Brain,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  useDeleteUserResponseMutation,
  useGetUserHistoryQuery,
} from "../../features/admin/adminSlice";
import { RichTextDisplay } from "../../utils/RichTextDisplay";

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

  const handleDelete = async (userId, userName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${userName}'s survey response. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        content: "swal-content",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteUserResponse(userId).unwrap();

        Swal.fire({
          title: "Deleted!",
          text: `${userName}'s response has been deleted successfully.`,
          icon: "success",
          confirmButtonColor: "#10b981",
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            content: "swal-content",
            confirmButton: "swal-success-btn",
          },
        });
      } catch (error) {
        console.error("Error deleting user response:", error);

        Swal.fire({
          title: "Error!",
          text: "Failed to delete the user response. Please try again.",
          icon: "error",
          confirmButtonColor: "#ef4444",
          customClass: {
            popup: "swal-popup",
            title: "swal-title",
            content: "swal-content",
            confirmButton: "swal-error-btn",
          },
        });
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
      {/* Custom SweetAlert2 Styles */}
      <style>{`
        .swal-popup {
          border-radius: 12px !important;
          font-family: 'Inter', sans-serif !important;
        }
        .swal-title {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
        }
        .swal-content {
          font-size: 1rem !important;
          color: #6b7280 !important;
        }
        .swal-confirm-btn {
          border-radius: 8px !important;
          font-weight: 500 !important;
          padding: 10px 20px !important;
        }
        .swal-cancel-btn {
          border-radius: 8px !important;
          font-weight: 500 !important;
          padding: 10px 20px !important;
        }
        .swal-success-btn {
          border-radius: 8px !important;
          font-weight: 500 !important;
          padding: 10px 20px !important;
        }
        .swal-error-btn {
          border-radius: 8px !important;
          font-weight: 500 !important;
          padding: 10px 20px !important;
        }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-800">User History</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {filteredHistory.length} Records
          </span>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users, emails, or usernames..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>User Information</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Survey Data</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>AI Status</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No user history found</p>
                    <p className="text-sm">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                const userName = getUserName(item.user_responses);
                const responseCount = item.user_responses?.length || 0;
                const hasAIResponse = !!item.ai_response;

                return (
                  <tr
                    key={item.user?.id || Math.random()}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
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
                          <div className="text-xs text-gray-400">
                            @{item.user?.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{responseCount}</span>
                          <span className="text-gray-500">responses</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Survey completed
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hasAIResponse ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-green-700 font-medium">
                            Generated
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                          <span className="text-sm text-gray-500">
                            Not available
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.created_on)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(item.user?.id, userName)}
                          disabled={isDeleting}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Delete Response"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
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
        <div className="flex items-center justify-between mt-6 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <span>Showing</span>
            <span className="font-medium">{indexOfFirstItem + 1}</span>
            <span>to</span>
            <span className="font-medium">
              {Math.min(indexOfLastItem, filteredHistory.length)}
            </span>
            <span>of</span>
            <span className="font-medium">{filteredHistory.length}</span>
            <span>entries</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
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
                  className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <button
                  onClick={() => paginate(totalPages)}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Modal for viewing user details */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">
                    User Response Details
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Complete survey data and AI recommendations
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Information Section */}
                <div className="lg:col-span-1">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">
                        User Information
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {getUserName(selectedUser.user_responses)
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {getUserName(selectedUser.user_responses)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Survey Participant
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">
                            {selectedUser.user?.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Username:</span>
                          <span className="font-medium text-gray-900">
                            @{selectedUser.user?.username}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Role:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {selectedUser.user?.role}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(selectedUser.created_on)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Responses:</span>
                          <span className="font-medium text-gray-900">
                            {selectedUser.user_responses?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Survey Responses Section */}
                <div className="lg:col-span-2">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">
                        Survey Questions & Answers
                      </h4>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {selectedUser.user_responses?.map((response, index) => (
                        <div
                          key={index}
                          className="bg-white border border-green-200 rounded-lg p-3"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-green-700">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm mb-1">
                                {response.question}
                              </p>
                              <p className="text-gray-700 text-sm bg-gray-50 px-3 py-2 rounded-md">
                                {response.response_text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Response Section */}
                  {selectedUser.ai_response && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-900">
                          AI Health Recommendations
                        </h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Generated
                        </span>
                      </div>
                      <div className="bg-white border border-purple-200 rounded-lg p-4 max-h-80 overflow-y-auto">
                        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          <RichTextDisplay content={selectedUser.ai_response} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() =>
                  handleDelete(
                    selectedUser.user?.id,
                    getUserName(selectedUser.user_responses)
                  )
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Delete Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHistory;
