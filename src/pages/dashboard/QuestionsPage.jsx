import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import QuestionModal from "../../components/modals/QuestionModal.jsx";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal.jsx";
import {
  useGetQuestionsQuery,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "../../features/questions/questionsApi";
import toast from "react-hot-toast";

const QuestionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // RTK Query hooks
  const {
    data: questions = [],
    isLoading,
    isError송기,
    error,
    refetch,
  } = useGetQuestionsQuery();
  const [addQuestion, { isLoading: isAddingQuestion }] =
    useAddQuestionMutation();
  const [updateQuestion, { isLoading: isUpdatingQuestion }] =
    useUpdateQuestionMutation();
  const [deleteQuestion, { isLoading: isDeletingQuestion }] =
    useDeleteQuestionMutation();

  // Filter and paginate questions
  const { paginatedQuestions, totalPages, totalItems } = useMemo(() => {
    // Filter questions based on search term
    const filtered = questions.filter(
      (q) =>
        q.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.question?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const total = filtered.length;
    const pages = Math.ceil(total / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);

    return {
      paginatedQuestions: paginated,
      totalPages: pages,
      totalItems: total,
    };
  }, [questions, searchTerm, currentPage, itemsPerPage]);

  // Reset to first page when search term changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleEdit = (question) => {
    // Normalize options to ensure consistent format
    const normalizeOptions = (opts) => {
      if (!opts || !Array.isArray(opts)) return [];
      return opts
        .map((opt) => {
          if (typeof opt === "string") return opt;
          if (typeof opt === "object" && opt !== null) {
            return opt.option_text || opt.text || opt.value || "";
          }
          return String(opt);
        })
        .filter(Boolean); // Remove falsy values
    };

    const formattedQuestion = {
      id: question.id,
      question: question.title || question.question || "",
      type: question.input_type || question.type || "text",
      placeholder: question.placeholder || "",
      options: normalizeOptions(question.options || question.choices),
    };
    setSelectedQuestion(formattedQuestion);
    setShowAddModal(true);
  };

  const handleDelete = (question) => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedQuestion) {
      try {
        await deleteQuestion(selectedQuestion.id).unwrap();
        toast.success("Question deleted successfully");
        setShowDeleteModal(false);
        setSelectedQuestion(null);
        // Adjust current page if necessary after deletion
        const newTotalItems = totalItems - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error(error.data?.message || "Failed to delete question");
      }
    }
  };

  const handleSaveQuestion = async (questionData, isEditing) => {
    try {
      if (isEditing) {
        // Update existing question
        await updateQuestion({
          id: questionData.id,
          question: questionData.question,
          type: questionData.type,
          placeholder: questionData.placeholder,
          options: questionData.options,
        }).unwrap();
        toast.success("Question updated successfully");
      } else {
        // Add new question
        await addQuestion({
          question: questionData.question,
          type: questionData.type,
          placeholder: questionData.placeholder,
          options: questionData.options,
        }).unwrap();
        toast.success("Question added successfully");
      }
      setShowAddModal(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error(error.data?.message || "Failed to save question");
    }
  };

  // Helper function to render question type badge
  const renderQuestionType = (type) => {
    const typeColors = {
      text: "bg-blue-100 text-blue-800",
      select: "bg-green-100 text-green-800",
      number: "bg-purple-100 text-purple-800",
      email: "bg-orange-100 text-orange-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          typeColors[type] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type === "text" ? "Text Input" : type === "select" ? "Dropdown" : type}
      </span>
    );
  };

  
  // Helper function to render placeholder or options
  const renderQuestionDetails = (question) => {
    const questionType = question.input_type || question.type;
    const placeholder = question.placeholder;
    const options = question.options || question.choices || [];

    if (questionType === "select") {
      if (options.length > 0) {
        return (
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">
              Available Options:
            </p>
            <div className="flex flex-wrap gap-1">
              {options.slice(0, 3).map((option, index) => (
                <span
                  key={index}
                  className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border"
                >
                  {typeof option === "object" ? option.option_text : option}
                </span>
              ))}
              {options.length > 3 && (
                <span className="inline-flex px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded border">
                  +{options.length - 3} more
                </span>
              )}
            </div>
          </div>
        );
      } else {
        return (
          <p className="text-xs text-gray-500 italic">
            No options configured for this dropdown
          </p>
        );
      }
    } else {
      // For text input types
      if (placeholder) {
        return (
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Placeholder:</p>
            <p className="text-sm text-gray-700 italic">{placeholder}</p>
          </div>
        );
      } else {
        return (
          <p className="text-xs text-gray-500 italic">
            No placeholder set for this text input
          </p>
        );
      }
    }
  };

  // Pagination component
  const PaginationControls = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is less than max visible
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show smart pagination with ellipsis
        if (currentPage <= 3) {
          // Show first pages
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          // Show last pages
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          // Show middle pages
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }
      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          results
        </div>
        <div className="flex items-center gap-2">
          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          {/* Pagination buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={`px-3 py-2 text-sm rounded-md border ${
                  page === currentPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : page === "..."
                    ? "border-transparent text-gray-400 cursor-default"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Question Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => {
              setSelectedQuestion(null);
              setShowAddModal(true);
            }}
            className="action-button"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Questions
          </button>
        </div>
      </div>

      {/* Question Statistics */}
      {questions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Pencil className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {
                    questions.filter((q) => (q.input_type || q.type) === "text")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">Text Input Questions</p>
                <p className="text-xs text-gray-500">
                  Questions with text input fields
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Pencil className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {
                    questions.filter(
                      (q) => (q.input_type || q.type) === "select"
                    ).length
                  }
                </p>
                <p className="text-sm text-gray-600">Dropdown Questions</p>
                <p className="text-xs text-gray-500">
                  Questions with selectable options
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Pencil className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{questions.length}</p>
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-xs text-gray-500">
                  All questions in the system
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-full">
                <Search className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{totalItems}</p>
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-xs text-gray-500">
                  Questions matching search
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedQuestions.map((question) => (
              <tr key={question.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {question.title || question.question}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderQuestionType(question.input_type || question.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderQuestionDetails(question)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(question)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                      disabled={isUpdatingQuestion}
                      title="Edit question"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(question)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                      disabled={isDeletingQuestion}
                      title="Delete question"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedQuestions.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  <div className="py-8">
                    <p className="text-lg font-medium">No questions found</p>
                    <p>
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Get started by adding your first question"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <PaginationControls />

      {/* Add/Edit Question Modal */}
      {showAddModal && (
        <QuestionModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedQuestion(null);
          }}
          question={selectedQuestion}
          onSave={handleSaveQuestion}
          isSubmitting={isAddingQuestion || isUpdatingQuestion}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          title="Are you sure?"
          message="Do you want to delete this question? This action cannot be undone."
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeletingQuestion}
        />
      )}
    </div>
  );
};

export default QuestionsPage;
