

import { ArrowLeft } from "lucide-react"

const ResponsePreview = ({ userName, recommendations, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <button onClick={onClose} className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
        <ArrowLeft size={20} />
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Hello {userName || "Charles"},</h2>
        <p className="mb-4">Thank you for using our service</p>

        <p className="mb-4">Based on your responses, here are preventive health recommendations:</p>

        <div className="space-y-4 mb-8">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex">
              <div className="mr-2 font-bold">{index + 1}.</div>
              <div>{recommendation}</div>
            </div>
          ))}
        </div>

        <p className="text-gray-600">
          Please take a moment to email these to yourself, a loved one or your medical provider.
        </p>
      </div>
    </div>
  )
}

export default ResponsePreview
