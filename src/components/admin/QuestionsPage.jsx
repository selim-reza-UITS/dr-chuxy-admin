

import { useState } from "react"
import { useAdmin } from "../../contexts/AdminContext"
import { Pencil, Trash2, Search, Plus } from "lucide-react"
import AddQuestionModal from "./AddQuestionModal.jsx"
import DeleteConfirmationModal from "./DeleteConfirmationModal.jsx"

const QuestionsPage = () => {
  const { questions, updateQuestion, deleteQuestion } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const filteredQuestions = questions.filter((q) => q.question.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setShowAddModal(true)
  }

  const handleDelete = (question) => {
    setSelectedQuestion(question)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (selectedQuestion) {
      deleteQuestion(selectedQuestion.id)
      setShowDeleteModal(false)
      setSelectedQuestion(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Question Name</h1>
        <div className="flex items-center space-x-2">
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
          <button
            onClick={() => {
              setEditingQuestion(null)
              setShowAddModal(true)
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-1" />
            Add Questions
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredQuestions.map((question) => (
              <tr key={question.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.question}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(question)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(question)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Question Modal */}
      {showAddModal && (
        <AddQuestionModal
          question={editingQuestion}
          onClose={() => {
            setShowAddModal(false)
            setEditingQuestion(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          title="Are you sure?"
          message="Do you want to delete this content?"
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default QuestionsPage
