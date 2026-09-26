import Icon from "../ui/Icon";
import { CourseThumb } from "./CourseThumb";
import {
  BADGE_STYLES,
  hashIndex,
  formatPrice,
} from "../../utils/instructorHelpers";

export const CourseCard = ({
  course,
  onAddLesson,
  onAddAssignment,
  onViewStudents,
  onEdit,
  onDelete,
}) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md">
    <div className="relative">
      <CourseThumb course={course} className="h-44 w-full" />
      <span
        className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset backdrop-blur ${
          BADGE_STYLES[hashIndex(course.category, BADGE_STYLES.length)]
        }`}
      >
        {course.category}
      </span>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug text-slate-900">
          {course.name}
        </h3>
        <p className="shrink-0 text-base font-semibold text-indigo-600">
          {formatPrice(course.price)}
        </p>
      </div>

      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
        {course.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => onAddLesson(course)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
        >
          <Icon name="video" className="h-4 w-4" />
          Add lesson
        </button>

        <button
          onClick={() => onAddAssignment(course)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-100"
        >
          <Icon name="clipboard" className="h-4 w-4" />
          Assignment
        </button>

        <button
          onClick={() => onViewStudents(course)}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
        >
          <Icon name="users" className="h-4 w-4" />
          Students
        </button>

        <button
          onClick={() => onEdit(course)}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Icon name="pencil" className="h-4 w-4" />
          Edit
        </button>

        <button
          onClick={() => onDelete(course)}
          className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
        >
          <Icon name="trash" className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  </article>
);
