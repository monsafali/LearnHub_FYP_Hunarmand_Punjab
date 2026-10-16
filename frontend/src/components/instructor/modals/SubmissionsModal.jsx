import { Modal } from "../../ui/Modal";
import Icon from "../../ui/Icon";
import { SubmissionStatusBadge } from "../CourseThumb";
import { inputClass } from "../../../utils/instructorHelpers";
import { useMemo, useState } from "react";

export const SubmissionsModal = ({
  assignment,
  submissions,
  submissionsLoading,
  gradingId,
  gradeForm,
  onGradeChange,
  onStartGrading,
  onSubmitGrade,
  onClose,
}) => (
  <SubmissionsModalContent
    assignment={assignment}
    submissions={submissions}
    submissionsLoading={submissionsLoading}
    gradingId={gradingId}
    gradeForm={gradeForm}
    onGradeChange={onGradeChange}
    onStartGrading={onStartGrading}
    onSubmitGrade={onSubmitGrade}
    onClose={onClose}
  />
);

const SubmissionsModalContent = ({
  assignment,
  submissions,
  submissionsLoading,
  gradingId,
  gradeForm,
  onGradeChange,
  onStartGrading,
  onSubmitGrade,
  onClose,
}) => {
  const [statusFilter, setStatusFilter] = useState("pending");
  const filteredSubmissions = useMemo(
    () => submissions.filter((submission) => {
      if (statusFilter === "pending") return submission.status !== "graded";
      if (statusFilter === "graded") return submission.status === "graded";
      return true;
    }),
    [submissions, statusFilter],
  );
  const pendingCount = submissions.filter((submission) => submission.status !== "graded").length;
  const gradedCount = submissions.length - pendingCount;

  return (
  <Modal
    title="Submissions"
    subtitle={`${assignment?.title} · ${assignment?.totalMarks} marks`}
    onClose={onClose}
  >
    {submissionsLoading ? (
      <div className="space-y-3">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="h-20 animate-pulse rounded-lg bg-slate-100"
          />
        ))}
      </div>
    ) : submissions.length === 0 ? (
      <p className="py-10 text-center text-sm text-slate-500">
        No students have submitted this assignment yet.
      </p>
    ) : (
      <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{submissions.length} student {submissions.length === 1 ? "submission" : "submissions"}</p>
        <div className="flex rounded-lg bg-slate-100 p-1" role="group" aria-label="Filter submissions by review status">
          <button type="button" onClick={() => setStatusFilter("pending")} aria-pressed={statusFilter === "pending"} className={`rounded-md px-3 py-1.5 text-xs font-medium ${statusFilter === "pending" ? "bg-white text-amber-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
            Needs review ({pendingCount})
          </button>
          <button type="button" onClick={() => setStatusFilter("graded")} aria-pressed={statusFilter === "graded"} className={`rounded-md px-3 py-1.5 text-xs font-medium ${statusFilter === "graded" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
            Checked ({gradedCount})
          </button>
          <button type="button" onClick={() => setStatusFilter("all")} aria-pressed={statusFilter === "all"} className={`rounded-md px-3 py-1.5 text-xs font-medium ${statusFilter === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
            All
          </button>
        </div>
      </div>
      {filteredSubmissions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
          {statusFilter === "pending" ? "No new submissions need review." : "No checked submissions yet."}
        </p>
      ) : (
      <ul className="space-y-3">
        {filteredSubmissions.map((submission) => {
          const student = submission.student;
          const isGrading = gradingId === submission._id;

          return (
            <li
              key={submission._id}
              className="rounded-xl border border-slate-100 p-4"
            >
              {/* Student information */}
              <div className="flex flex-wrap items-center gap-3">
                {student?.imageUrl ? (
                  <img
                    src={student.imageUrl}
                    alt={student.fullname}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-sm font-semibold text-white">
                    {student?.fullname?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {student?.fullname || "Unknown student"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {student?.email || "No email"}
                  </p>
                </div>

                <SubmissionStatusBadge status={submission.status} />

                {/* Student answer PDF */}
                {submission.answerUrl && (
                  <a
                    href={submission.answerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Icon name="download" className="h-3.5 w-3.5" />
                    Answer PDF
                  </a>
                )}
              </div>

              {/* Existing grade + feedback */}
              {submission.status === "graded" && !isGrading && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">
                      Score
                    </p>

                    <p className="text-sm font-bold text-emerald-600">
                      {submission.marks}/{assignment?.totalMarks}
                    </p>
                  </div>

                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-500">
                      Feedback
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {submission.feedback || "No feedback provided."}
                    </p>
                  </div>
                </div>
              )}

              {/* Grading form */}
              {isGrading ? (
                <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="number"
                      name="marks"
                      placeholder={`Marks out of ${assignment?.totalMarks}`}
                      value={gradeForm.marks}
                      onChange={onGradeChange}
                      min="0"
                      max={assignment?.totalMarks}
                      className={`${inputClass} sm:w-40`}
                    />

                    <input
                      type="text"
                      name="feedback"
                      placeholder="Feedback (optional)"
                      value={gradeForm.feedback}
                      onChange={onGradeChange}
                      className={inputClass}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onSubmitGrade(submission._id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                    >
                      <Icon name="check" className="h-3.5 w-3.5" />
                      Save grade
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartGrading(null)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Grade button */
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                  <p className="text-slate-600">
                    {submission.status === "graded"
                      ? `Graded: ${submission.marks}/${assignment?.totalMarks}`
                      : "Not graded yet"}
                  </p>

                  <button
                    type="button"
                    onClick={() => onStartGrading(submission)}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                  >
                    {submission.status === "graded"
                      ? "Edit grade"
                      : "Grade"}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      )}
      </>
    )}
  </Modal>
  );
};

