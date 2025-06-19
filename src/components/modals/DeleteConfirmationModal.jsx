import { AlertTriangle } from "lucide-react"

const DeleteConfirmationModal = ({ title, message, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="confirmation-modal-icon">
          <AlertTriangle size={24} />
        </div>

        <h2 className="confirmation-modal-title">{title}</h2>
        <p className="confirmation-modal-message">{message}</p>

        <div className="modal-footer">
          <button onClick={onCancel} className="cancel-button" disabled={isLoading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="delete-button" disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
