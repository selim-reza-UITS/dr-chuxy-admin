

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const ResponsePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState([])
  const [userName, setUserName] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    // Check if we have form data
    if (!location.state || !location.state.formData) {
      navigate("/")
      return
    }

    const { formData } = location.state

    // Extract name from form data (assuming question id 1 is name)
    if (formData[1]) {
      setUserName(formData[1].split(" ")[0] || "there")
    }

    // Simulate API call to get AI-generated recommendations
    setTimeout(() => {
      // Mock recommendations based on form data
      const mockRecommendations = [
        "Rest: Make sure to get plenty of rest, as your body needs energy to fight off the infection causing the fever.",
        "Stay Hydrated: Drink plenty of fluids like water, herbal teas, or electrolyte drinks. Fever can cause dehydration, so staying hydrated is crucial.",
        "Take Medication: Over-the-counter medications like acetaminophen (Tylenol) or ibuprofen (Advil, Motrin) can help reduce the fever and ease any discomfort. Make sure to follow the recommended dosage instructions.",
        "Keep Cool: Avoid overheating. Wear light, comfortable clothing and keep your room cool. You can use a cool compress on your forehead or take a lukewarm bath to help lower your temperature.",
        "Monitor Your Temperature: Check your temperature regularly. If it rises above 103°F (39.4°C) or lasts for more than 3 days, it's important to seek medical attention.",
        "Seek Medical Help if Needed: If you experience severe symptoms such as difficulty breathing, persistent chest pain, confusion, severe headache, or if the fever does not improve, contact a healthcare professional immediately.",
      ]

      setRecommendations(mockRecommendations)
      setLoading(false)
    }, 2000)
  }, [location.state, navigate])

  const handleSendEmail = (e) => {
    e.preventDefault()
    setSending(true)

    // Simulate sending email
    setTimeout(() => {
      setSending(false)
      setSent(true)

      // Reset after 3 seconds
      setTimeout(() => {
        setShowEmailForm(false)
        setSent(false)
      }, 3000)
    }, 1500)
  }

  const handleCopyToClipboard = () => {
    const text = `
Hello ${userName},

Thank you for using our service.

Based on your responses, here are preventive health recommendations just for you:

${recommendations.map((rec, index) => `${index + 1}. ${rec}`).join("\n")}

Please take a moment to email these to yourself, a loved one or your medical provider.
    `

    navigator.clipboard.writeText(text)
    alert("Recommendations copied to clipboard!")
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>

          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="mb-4">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-gray-600">Generating your personalized recommendations...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
      <h1 className="text-xl font-semibold mb-2">Hello {userName},</h1>
      <p className="text-gray-600 mb-4">Thank you for using our service.</p>

      <p className="mb-4">Based on your responses, here are preventive health recommendations just for you:</p>
      <p className="mb-6 text-gray-600">
        Please take a moment to email these to yourself, a loved one or your medical provider.
      </p>

      <div className="space-y-4 mb-8">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex">
            <div className="mr-2 font-bold">{index + 1}.</div>
            <div>{recommendation}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={handleCopyToClipboard}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          Copy
        </button>

        <button
          onClick={() => setShowEmailForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Email Results
        </button>
      </div>

      {showEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            {!sent ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Email: Please review your message and send now</h2>
                <div className="border rounded-md p-3 mb-4 max-h-40 overflow-y-auto text-sm bg-gray-50">
                  <p>Hello {userName},</p>
                  <p className="my-2">Thank you for using our service.</p>
                  <p className="mb-2">
                    Based on your responses, here are preventive health recommendations just for you:
                  </p>
                  <div className="pl-4">
                    {recommendations.map((rec, i) => (
                      <p key={i} className="mb-1">
                        {i + 1}. {rec}
                      </p>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendEmail}>
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEmailForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      disabled={sending}
                    >
                      {sending ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Email"
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Sent Successfully</h3>
                <p className="mt-2 text-sm text-gray-500">Your health recommendations have been sent to {email}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResponsePage
