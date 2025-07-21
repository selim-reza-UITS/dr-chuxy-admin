"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Trash2, AlertTriangle } from "lucide-react"
import { useGetPdfListQuery, useDeletePdfByPmidMutation } from "../../features/pdfUpload/pdfUploadApi"

const PDFList = () => {
  const { data: documents = [], isLoading, error } = useGetPdfListQuery()
  const [deletePdfByPmid, { isLoading: isDeleting }] = useDeletePdfByPmidMutation()

  const [currentPage, setCurrentPage] = useState(1)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [deleteSuccess, setDeleteSuccess] = useState(null)

  const itemsPerPage = 8

  // Calculate pagination
  const totalPages = Math.ceil(documents.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = documents.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const handleDeleteClick = (doc) => {
    setDeleteConfirm(doc)
    setDeleteError(null)
    setDeleteSuccess(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm?.pmid) {
      setDeleteError("No PMID found for this document")
      return
    }

    try {
      await deletePdfByPmid(deleteConfirm.pmid).unwrap()
      setDeleteSuccess(`Successfully deleted PDF with PMID: ${deleteConfirm.pmid}`)
      setDeleteConfirm(null)

      // Clear success message after 3 seconds
      setTimeout(() => setDeleteSuccess(null), 3000)
    } catch (err) {
      setDeleteError(err?.data?.message || "Failed to delete PDF")
      setDeleteConfirm(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm(null)
    setDeleteError(null)
  }

  if (isLoading) return <div className="text-center py-4">Loading...</div>
  if (error) return <div className="text-center py-4 text-red-600">Error loading documents: {error.message}</div>

  return (
    <div>
      {/* Success Message */}
      {deleteSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">{deleteSuccess}</div>
      )}

      {/* Error Message */}
      {deleteError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">{deleteError}</div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the PDF with PMID: <strong>{deleteConfirm.pmid}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                      <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 16L7 10H17L12 16Z" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V18C22 19.6569 20.6569 21 19 21H5C3.34315 21 2 19.6569 2 18V6ZM5 5C4.44772 5 4 5.44772 4 6V18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18V6C20 5.44772 19.5523 5 19 5H5Z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {doc.pmid ? `PMID: ${doc.pmid}` : "Unnamed Document"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(doc.uploaded_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.file_size}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDeleteClick(doc)}
                    disabled={!doc.pmid || isDeleting}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={!doc.pmid ? "No PMID available for deletion" : "Delete PDF"}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-700">
        <div>
          Showing data {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, documents.length)} of {documents.length}{" "}
          entries
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1 rounded-md ${currentPage === 1 ? "text-gray-400" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = index + 1
            } else if (currentPage <= 3) {
              pageNum = index + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + index
            } else {
              pageNum = currentPage - 2 + index
            }

            return (
              <button
                key={index}
                onClick={() => paginate(pageNum)}
                className={`h-8 w-8 flex items-center justify-center rounded-md ${
                  currentPage === pageNum ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            )
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
              currentPage === totalPages ? "text-gray-400" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PDFList
