import { Modal, Field, FilePicker } from "../../ui/Modal";
import { inputClass } from "../../../utils/instructorHelpers";

export const LessonModal = ({
  course,
  onClose,
  onSubmit,
  lessonForm,
  onChange,
  lessonVideo,
  setLessonVideo,
  loading,
}) => (
  <Modal title="Add lesson" subtitle={`Course: ${course?.name}`} onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Lesson title">
        <input
          type="text"
          name="title"
          placeholder="e.g. Introduction to hooks"
          value={lessonForm.title}
          onChange={onChange}
          required
          className={inputClass}
        />
      </Field>

      <Field label="Lesson video">
        <FilePicker
          accept="video/*"
          file={lessonVideo}
          onChange={setLessonVideo}
          emptyText="Choose a video file"
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Add lesson"}
      </button>
    </form>
  </Modal>
);
