import { Modal, Field, FilePicker } from "../../ui/Modal";
import { inputClass } from "../../../utils/instructorHelpers";

export const AssignmentModal = ({
  course,
  onClose,
  onSubmit,
  assignmentForm,
  onChange,
  assignmentFile,
  setAssignmentFile,
  loading,
}) => (
  <Modal title="New assignment" subtitle={`Course: ${course?.name}`} onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Assignment title">
        <input
          type="text"
          name="title"
          placeholder="e.g. Build a REST API"
          value={assignmentForm.title}
          onChange={onChange}
          required
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Total marks">
          <input
            type="number"
            name="totalMarks"
            placeholder="100"
            value={assignmentForm.totalMarks}
            onChange={onChange}
            min="1"
            required
            className={inputClass}
          />
        </Field>

        <Field label="Due date" hint="Optional">
          <input
            type="date"
            name="dueDate"
            value={assignmentForm.dueDate}
            onChange={onChange}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Description" hint="Optional">
        <textarea
          name="description"
          placeholder="Instructions for students"
          value={assignmentForm.description}
          onChange={onChange}
          rows={3}
          className={inputClass}
        />
      </Field>

      <Field label="Assignment PDF">
        <FilePicker
          accept="application/pdf"
          file={assignmentFile}
          onChange={setAssignmentFile}
          required
          emptyText="Choose a PDF file"
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-violet-600 py-3 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish assignment"}
      </button>
    </form>
  </Modal>
);
