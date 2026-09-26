export const formatDuration = (seconds) => {
  const totalSeconds = Number(seconds) || 0;

  if (totalSeconds < 60) return `${totalSeconds}s`;

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return remainingSeconds === 0 ? `${minutes}m` : `${minutes}m ${remainingSeconds}s`;
};

export const formatDate = (value) => {
  if (!value) return "No due date";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const submissionStatusStyle = (status) => {
  const value = (status || "not_submitted").toLowerCase();

  if (value === "graded") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (value === "submitted") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (value === "late") return "bg-rose-50 text-rose-700 ring-rose-200";
  return "bg-gray-100 text-gray-600 ring-gray-200";
};

export const submissionStatusLabel = (status) => {
  if (!status) return "Not submitted";
  return status.charAt(0).toUpperCase() + status.slice(1);
};
