import { Field } from "../../ui/Modal";
import { inputClass } from "../../../utils/instructorHelpers";

export const CourseFormFields = ({ courseForm, onChange }) => (
  <>
    <Field label="Course name">
      <input
        type="text"
        name="name"
        placeholder="e.g. Complete React Bootcamp"
        value={courseForm.name}
        onChange={onChange}
        required
        className={inputClass}
      />
    </Field>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Category">
        <input
          type="text"
          name="category"
          placeholder="e.g. Web development"
          value={courseForm.category}
          onChange={onChange}
          required
          className={inputClass}
        />
      </Field>

      <Field label="Price (Rs.)">
        <input
          type="number"
          name="price"
          placeholder="0"
          value={courseForm.price}
          onChange={onChange}
          min="0"
          required
          className={inputClass}
        />
      </Field>
    </div>

    <Field label="Description">
      <textarea
        name="description"
        placeholder="What will students learn in this course?"
        value={courseForm.description}
        onChange={onChange}
        required
        rows={4}
        className={inputClass}
      />
    </Field>
  </>
);
