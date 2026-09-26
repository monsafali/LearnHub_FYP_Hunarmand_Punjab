import { Modal } from "../../ui/Modal";
import { CourseFormFields } from "./CourseFormFields";

export const EditCourseModal = ({ course, onClose, onSubmit, courseForm, onChange, loading }) => (
  <Modal title="Edit course" subtitle={course?.name} onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <CourseFormFields courseForm={courseForm} onChange={onChange} />

      <p className="rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
        The course image can't be changed from here yet.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  </Modal>
);
