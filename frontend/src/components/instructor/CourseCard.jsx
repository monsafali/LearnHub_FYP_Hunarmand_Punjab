import { CourseThumb } from "./CourseThumb";
import {
  BADGE_STYLES,
  hashIndex,
  formatPrice,
} from "../../utils/instructorHelpers";

export const CourseCard = ({
  course,
}) => (
  <article role="link" tabIndex={0} onClick={() => window.location.assign(`/instructor/course/${course._id}`)} onKeyDown={(event) => event.key === "Enter" && window.location.assign(`/instructor/course/${course._id}`)} className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
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

      <p className="mt-5 rounded-lg bg-indigo-50 px-3 py-2 text-center text-sm font-medium text-indigo-700">Open course and manage content →</p>
    </div>
  </article>
);
