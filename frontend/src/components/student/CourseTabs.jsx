export const CourseTabs = ({ activeTab, onChange, assignmentCount }) => (
  <div className="border-b bg-white px-4">
    <div className="mx-auto flex max-w-7xl gap-6">
      <button
        onClick={() => onChange("content")}
        className={`border-b-2 px-1 py-3 text-sm font-medium transition ${
          activeTab === "content"
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-800"
        }`}
      >
        Course Content
      </button>

      <button
        onClick={() => onChange("assignments")}
        className={`flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition ${
          activeTab === "assignments"
            ? "border-blue-600 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-800"
        }`}
      >
        Assignments
        {assignmentCount > 0 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
            {assignmentCount}
          </span>
        )}
      </button>
    </div>
  </div>
);
