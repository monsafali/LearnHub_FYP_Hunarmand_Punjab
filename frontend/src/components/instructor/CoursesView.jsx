import Icon from "../ui/Icon";
import { CourseCard } from "./CourseCard";
import { inputClass } from "../../utils/instructorHelpers";

export const CoursesView = ({
  instructorCourses,
  filteredCourses,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  categoryOptions,
  loading,
  onRefresh,
  onCreate,
  onAddLesson,
  onAddAssignment,
  onViewStudents,
  onEdit,
  onDelete,
}) => (
  <div className="space-y-5">
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your courses"
          className={`${inputClass} pl-10`}
        />
      </div>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className={`${inputClass} md:w-52`}
      >
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat === "All" ? "All categories" : cat}
          </option>
        ))}
      </select>

      <button
        onClick={onRefresh}
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      >
        <Icon name="refresh" className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        Refresh
      </button>

      <button
        onClick={onCreate}
        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        <Icon name="plus" className="h-4 w-4" />
        New course
      </button>
    </div>

    {loading && instructorCourses.length === 0 ? (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-slate-100" />
        ))}
      </div>
    ) : instructorCourses.length === 0 ? (
      <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Icon name="book" className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No courses yet</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          Create your first course, then add lessons so students can start learning.
        </p>
        <button
          onClick={onCreate}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Create course
        </button>
      </div>
    ) : filteredCourses.length === 0 ? (
      <div className="rounded-2xl bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-100">
        No courses match your search. Try a different keyword or category.
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onAddLesson={onAddLesson}
            onAddAssignment={onAddAssignment}
            onViewStudents={onViewStudents}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    )}
  </div>
);
