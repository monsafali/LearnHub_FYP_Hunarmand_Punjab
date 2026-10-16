import Icon from "../ui/Icon";
import { inputClass, formatDate } from "../../utils/instructorHelpers";
import { useMemo, useState } from "react";

export const AssignmentsView = ({
  instructorCourses,
  assignmentsCourseId,
  loadAssignments,
  assignments,
  assignmentsLoading,
  submissionSummaries,
  submissionSummaryLoading,
  submissionsDueToday,
  onAddAssignment,
  onViewSubmissions,
}) => {
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const assignmentsCourse = instructorCourses.find((c) => c._id === assignmentsCourseId);
  const todayPendingCount = (submissionList = []) => {
    const today = new Date();
    return submissionList.filter((submission) => {
      if (submission.status === "graded" || !submission.submittedAt) return false;
      const submittedAt = new Date(submission.submittedAt);
      return submittedAt.getFullYear() === today.getFullYear()
        && submittedAt.getMonth() === today.getMonth()
        && submittedAt.getDate() === today.getDate();
    }).length;
  };
  const filteredAssignments = useMemo(() => assignments.filter((assignment) => {
    const list = submissionSummaries[assignment._id] || [];
    const pending = list.filter((submission) => submission.status !== "graded").length;
    if (assignmentFilter === "pending") return pending > 0;
    if (assignmentFilter === "checked") return list.length > 0 && pending === 0;
    return true;
  }), [assignments, assignmentFilter, submissionSummaries]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">
            {assignmentsCourse ? assignmentsCourse.name : "Choose a course to see its assignments"}
          </p>
          <p className="text-sm text-slate-500">
            {assignmentsCourse && !assignmentsLoading
              ? `${assignments.length} ${assignments.length === 1 ? "assignment" : "assignments"}`
              : "Assignments are loaded per course"}
          </p>
        </div>

        <select
          value={assignmentsCourseId}
          onChange={(e) => loadAssignments(e.target.value)}
          className={`${inputClass} md:w-72`}
        >
          <option value="">Select a course</option>
          {instructorCourses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>

        <button
          disabled={!assignmentsCourse}
          onClick={() => onAddAssignment(assignmentsCourse)}
          className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="plus" className="h-4 w-4" />
          New assignment
        </button>
      </div>

      {assignmentsCourseId && (
        <section className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-900">Student work to review today</p>
            <p className="mt-1 text-sm text-amber-800">New submissions received today that still need grading</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-amber-950">{submissionSummaryLoading ? "…" : submissionsDueToday}</span>
            <button
              type="button"
              onClick={() => {
                const assignmentToReview = assignments.find(
                  (assignment) => todayPendingCount(submissionSummaries[assignment._id] || []) > 0,
                );
                if (assignmentToReview) onViewSubmissions(assignmentToReview);
                else setAssignmentFilter("pending");
              }}
              disabled={submissionSummaryLoading || submissionsDueToday === 0}
              className="rounded-lg bg-amber-700 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Review submissions
            </button>
          </div>
        </section>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {!assignmentsCourseId ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Icon name="clipboard" className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm text-slate-500">Pick a course above to see its assignments.</p>
          </div>
        ) : assignmentsLoading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2].map((n) => (
              <div key={n} className="flex animate-pulse items-center gap-4 p-5">
                <div className="h-10 w-10 rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 rounded bg-slate-100" />
                  <div className="h-3 w-32 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No assignments have been created for this course yet.
          </div>
        ) : (
          <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3">
            <p className="text-sm text-slate-500">Filter by student review status</p>
            <select value={assignmentFilter} onChange={(event) => setAssignmentFilter(event.target.value)} aria-label="Filter assignments by submission review status" className={`${inputClass} md:w-64`}>
              <option value="all">All assignments</option>
              <option value="pending">Needs review</option>
              <option value="checked">All submissions checked</option>
            </select>
          </div>
          {filteredAssignments.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              {assignmentFilter === "pending" ? "No student submissions need review." : "No assignments match this filter."}
            </div>
          ) : (
          <ul className="divide-y divide-slate-100">
            {filteredAssignments.map((assignment) => {
              const submissionList = submissionSummaries[assignment._id] || [];
              const pendingCount = submissionList.filter((submission) => submission.status !== "graded").length;
              const todayCount = todayPendingCount(submissionList);
              return (
              <li
                key={assignment._id}
                className="flex flex-wrap items-center gap-4 p-5 transition hover:bg-slate-50/70"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Icon name="clipboard" className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{assignment.title}</p>
                  <p className="truncate text-sm text-slate-500">
                    Due {formatDate(assignment.dueDate)} &middot; {assignment.totalMarks} marks
                  </p>
                  <p className={`mt-1 text-xs font-medium ${pendingCount ? "text-amber-700" : "text-slate-500"}`}>
                    {submissionSummaryLoading ? "Loading student submissions…" : `${pendingCount} pending review${pendingCount === 1 ? "" : "s"}${todayCount ? ` · ${todayCount} received today` : ""}`}
                  </p>
                </div>

                <a
                  href={assignment.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <Icon name="download" className="h-4 w-4" />
                  PDF
                </a>

                <button
                  onClick={() => onViewSubmissions(assignment)}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                >
                  <Icon name="users" className="h-4 w-4" />
                  Submissions
                </button>
              </li>
              );
            })}
          </ul>
          )}
          </>
        )}
      </div>
    </div>
  );
};
