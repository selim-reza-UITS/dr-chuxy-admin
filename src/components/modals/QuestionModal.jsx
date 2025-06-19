import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from 'lucide-react';

const QuestionModal = ({ question, onClose, onSave, isSubmitting }) => {
  const [questionData, setQuestionData] = useState({
    question: "",
    type: "text",
    placeholder: "",
    options: [],
  });
  const [newOption, setNewOption] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (question) {
      setQuestionData({
        id: question.id,
        question: question.question || "",
        type: question.type || "text",
        placeholder: question.placeholder || "",
        options: question.options || [],
      });
      setIsEditing(true);
    }
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  const handleTypeChange = (type) => {
    setQuestionData({
      ...questionData,
      type,
      // Reset options if changing from select to text
      options: type === "text" ? [] : questionData.options,
    });
  };

  const addOption = () => {
    if (newOption.trim()) {
      setQuestionData({
        ...questionData,
        options: [...questionData.options, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const removeOption = (index) => {
    const newOptions = [...questionData.options];
    newOptions.splice(index, 1);
    setQuestionData({
      ...questionData,
      options: newOptions,
    });
  };

  const handleSubmit = async () => {
    if (!questionData.question.trim()) {
      alert("Question name is required");
      return;
    }

    if (questionData.type === "select" && questionData.options.length === 0) {
      alert("Select type questions must have at least one option");
      return;
    }

    // Call the onSave callback with the question data
    onSave(questionData, isEditing);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add New Questions</h2>
          <button onClick={onClose} className="modal-close" disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-4">
            <input
              type="text"
              name="question"
              placeholder="Type here"
              className="auth-input"
              value={questionData.question}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Options</h3>
            <div className="question-type-buttons">
              <button
                type="button"
                onClick={() => handleTypeChange("text")}
                className={`question-type-button ${
                  questionData.type === "text" ? "active" : ""
                }`}
                disabled={isSubmitting}
              >
                Text Input
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange("select")}
                className={`question-type-button ${
                  questionData.type === "select" ? "active" : ""
                }`}
                disabled={isSubmitting}
              >
                Dropdown
              </button>
            </div>

            {questionData.type === "text" && (
              <input
                type="text"
                name="placeholder"
                placeholder="Placeholder text"
                className="auth-input mt-2"
                value={questionData.placeholder}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            )}

            {questionData.type === "select" && (
              <div className="options-container">
                <div className="option-input-container">
                  <input
                    type="text"
                    placeholder="Type here"
                    className="option-input"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addOption();
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={addOption}
                    className="option-add-button"
                    disabled={isSubmitting}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto mt-2">
                  {questionData.options.map((option, index) => (
                    <div key={index} className="option-item">
                      <span>{option}</span>
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="option-remove-button"
                        disabled={isSubmitting}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={handleSubmit}
            className="save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;