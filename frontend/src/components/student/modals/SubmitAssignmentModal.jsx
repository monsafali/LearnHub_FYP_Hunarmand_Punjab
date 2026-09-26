import { Modal, Field, FilePicker } from "../../ui/Modal";

export const SubmitAssignmentModal = ({
  assignment,
  onClose,
  onSubmit,
  file,
  setFile,
  loading,
}) => (
  <Modal title="Submit assignment" subtitle={assignment?.title} onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Your submission">
        <FilePicker
          accept=".pdf,.doc,.docx,.zip"
          file={file}
          onChange={setFile}
          required
          emptyText="Choose a file to submit"
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  </Modal>
);
