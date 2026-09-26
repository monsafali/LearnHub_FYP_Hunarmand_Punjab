import { Modal, Field, FilePicker } from "../../ui/Modal";
import { CourseFormFields } from "./CourseFormFields";

export const CreateCourseModal = ({
  onClose,
  onSubmit,
  courseForm,
  onChange,
  courseImage,
  setCourseImage,
  loading,
}) => (
  <Modal title="Create course" subtitle="Fill in the details students will see" onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <CourseFormFields courseForm={courseForm} onChange={onChange} />

      <Field label="Course image">
        <FilePicker
          accept="image/png,image/jpeg,image/jpg"
          file={courseImage}
          onChange={setCourseImage}
          required
          emptyText="Choose a PNG or JPG image"
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create course"}
      </button>
    </form>
  </Modal>
);
