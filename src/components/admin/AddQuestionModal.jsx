

import { useState, useEffect } from "react"
import { useAdmin } from "../../contexts/AdminContext"
import { X, Plus, Trash2 } from "lucide-react"

const AddQuestionModal = ({ question, onClose }) => {
  const { addQuestion, updateQuestion } = useAdmin()
  const [questionData, setQuestionData] = useState({
    question: "",
    type: "text",
    placeholder: "",
    options: [],
  })
  const [newOption, setNewOption] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (question) {
      setQuestionData({
        question: question.question || "",
        type: question.type || "text",
        placeholder: question.placeholder || "",
        options: question.options || [],
      })
      setIsEditing(true)
    }
  }, [question])

  const handleChange = (e) => {
    const { name, value } = e.target
    setQuestionData({
      ...questionData,
      [name]: value,
    })
  }

  const handleTypeChange = (e) => {
    const type = e.target.value
    setQuestionData({
      ...questionData,
      type,
      // Reset options if changing from select to text
      options: type === "text" ? [] : questionData.options,
    })
  }

  const addOption = () => {
    if (newOption.trim()) {
      setQuestionData({
        ...questionData,
        options: [...questionData.options, newOption.trim()],
      })
      setNewOption("")
    }
  }

  const removeOption = (index) => {
    const newOptions = [...questionData.options]
    newOptions.splice(index, 1)
    setQuestionData({
      ...questionData,
      options: newOptions,
    })
  }

  const handleSubmit = () => {
    if (!questionData.question.trim()) {
      alert("Question name is required")
      return
    }

    if (questionData.type === "select" && questionData.options.length === 0) {
      alert("Select type questions must have at least one option")
      return
    }

    if (isEditing) {
      updateQuestion(question.id, questionData)
    } else {
      addQuestion(questionData)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Add New Questions</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <input
              type="text"
              name="question"
              placeholder="Type here"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={questionData.question}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Options</h3>
            <div className="flex space-x-2 mb-2">
              <button
                type="button"
                onClick={() => handleTypeChange({ target: { value: "text" } })}
                className={`px-4 py-1 rounded-md ${
                  questionData.type === "text" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Text Input
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange({ target: { value: "select" } })}
                className={`px-4 py-1 rounded-md ${
                  questionData.type === "select" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Dropdown
              </button>
            </div>

            {questionData.type === "text" && (
              <input
                type="text"
                name="placeholder"
                placeholder="Placeholder text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={questionData.placeholder}
                onChange={handleChange}
              />
            )}

            {questionData.type === "select" && (
              <div>
                <div className="flex mb-2">
                  <input
                    type="text"
                    placeholder="Type here"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addOption()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addOption}
                    className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {questionData.options.map((option, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <span>{option}</span>
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddQuestionModal
