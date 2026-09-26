import { CheckCircle2, Download, FileText, UploadCloud } from "lucide-react";
import {
  formatDate,
  submissionStatusLabel,
  submissionStatusStyle,
} from "../../utils/studentHelpers";

export const AssignmentsPanel = ({
  assignments,
  loading,
  onSubmit,
  onViewResult,
}) => {
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-3 px-5 py-8">
        {[1, 2].map((n) => (
          <div key={n} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-16 text-center">
        <FileText size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="font-medium text-gray-700">No assignments yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Your instructor hasn't published any assignments for this course.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-5 py-8 md:px-8">
      {assignments.map((assignment) => {
        const status = assignment.mySubmission?.status;

        return (
          <div key={assignment._id} className="rounded-xl border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900">
                  {assignment.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Due {formatDate(assignment.dueDate)} &middot;{" "}
                  {assignment.totalMarks} marks
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${submissionStatusStyle(status)}`}
              >
                {submissionStatusLabel(status)}
              </span>
            </div>

            {assignment.description && (
              <p className="mt-3 whitespace-pre-line text-sm text-gray-600">
                {assignment.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={assignment.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <Download size={15} />
                Assignment PDF
              </a>

              {status === "graded" ? (
                <button
                  onClick={() => onViewResult(assignment)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  <CheckCircle2 size={15} />
                  View result
                </button>
              ) : status === "submitted" ? (
                <button
                  onClick={() => onSubmit(assignment)}
                  className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  <UploadCloud size={15} />
                  Resubmit
                </button>
              ) : (
                <button
                  onClick={() => onSubmit(assignment)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <UploadCloud size={15} />
                  Submit assignment
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
