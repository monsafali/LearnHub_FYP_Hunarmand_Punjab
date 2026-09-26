import { Modal } from "../../ui/Modal";

export const AssignmentResultModal = ({ assignment, result, loading, onClose }) => (
  <Modal title="Assignment result" subtitle={assignment?.title} onClose={onClose}>
    {loading ? (
      <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
    ) : !result ? (
      <p className="py-6 text-center text-sm text-gray-500">
        This assignment hasn't been graded yet.
      </p>
    ) : (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
          <span className="text-sm font-medium text-emerald-700">Score</span>
          <span className="text-lg font-bold text-emerald-700">
            {result.marks} / {assignment?.totalMarks}
          </span>
        </div>

        {result.feedback && (
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">Instructor feedback</p>
            <p className="whitespace-pre-line rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
              {result.feedback}
            </p>
          </div>
        )}
      </div>
    )}
  </Modal>
);
