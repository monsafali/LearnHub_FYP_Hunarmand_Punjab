export const UsersTable = ({ filteredUsers, search, setSearch }) => (
  <>
    <div className="mb-6">
      <h2 className="text-2xl font-bold">All Users</h2>
      <p className="mt-1 text-sm text-gray-500">View all registered users</p>
    </div>

    <div className="mb-5">
      <input
        type="text"
        placeholder="Search by name, username, email or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-blue-500"
      />
    </div>

    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((item) => (
              <tr key={item._id} className="border-b last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.fullname}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                        {item.fullname?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-medium">{item.fullname}</p>
                      <p className="text-xs text-gray-500">@{item.username}</p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">{item.email}</td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {item.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.isActive && !item.deactivated
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isActive && !item.deactivated ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);
