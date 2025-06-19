

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAdmin } from "../contexts/AdminContext"

const SurveyForm = () => {
  const { questions } = useAdmin()
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const questionsPerPage = 5
  const totalPages = Math.ceil(questions.length / questionsPerPage)

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // In a real app, this would send data to the backend
    console.log("Form submitted:", formData)

    // Navigate to response page with form data
    navigate("/response", { state: { formData } })
  }

  const nextPage = () => {
    if (currentStep < totalPages - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevPage = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Get current questions
  const currentQuestions = questions.slice(currentStep * questionsPerPage, (currentStep + 1) * questionsPerPage)

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
      <h1 className="text-2xl font-bold text-center mb-2">Health Related Survey</h1>
      <p className="text-gray-600 text-center mb-6">Personalized health recommendations</p>

      <form onSubmit={handleSubmit}>
        {currentQuestions.map((q) => (
          <div key={q.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">{q.question}</label>

            {q.type === "text" && (
              <input
                type="text"
                placeholder={q.placeholder}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}

            {q.type === "select" && (
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {q.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prevPage}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Previous
            </button>
          )}

          {currentStep < totalPages - 1 ? (
            <button
              type="button"
              onClick={nextPage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
            >
              Next
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto">
              Submit
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Page {currentStep + 1} of {totalPages}
        </div>
      </form>
    </div>
  )
}

export default SurveyForm
