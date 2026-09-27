import { UserPlus } from "lucide-react";

export const InstructorsTable = ({ instructors, onCreate, onEdit, onDelete }) => (
  <>
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="text-2xl font-bold">Instructors</h2>
        <p className="text-sm text-gray-500">Manage your platform instructors</p>
      </div>

      <button
        onClick={onCreate}
        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
      >
        <UserPlus size={18} />
        Create Instructor
      </button>
    </div>

    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-5 py-4">Instructor</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor._id} className="border-b last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {instructor.imageUrl ? (
                      <img
                        src={instructor.imageUrl}
                        alt={instructor.fullname}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                        {instructor.fullname?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-medium">{instructor.fullname}</p>
                      <p className="text-xs text-gray-500">@{instructor.username}</p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">{instructor.email}</td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      instructor.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {instructor.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(instructor)}
                      className="rounded-lg border px-3 py-2 text-xs font-medium hover:bg-gray-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(instructor._id)}
                      className="rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {instructors.length === 0 && (
        <div className="p-10 text-center text-gray-500">No instructors found.</div>
      )}
    </div>
  </>
);
