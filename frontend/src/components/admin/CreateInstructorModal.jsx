import { AdminModal, AdminInput } from "./AdminModal";

export const CreateInstructorModal = ({
  onClose,
  onSubmit,
  form,
  updateField,
  loading,
}) => (
  <AdminModal title="Create Instructor" onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <AdminInput
        label="Full Name"
        value={form.fullname}
        onChange={updateField("fullname")}
      />
      <AdminInput
        label="Username"
        value={form.username}
        onChange={updateField("username")}
      />
      <AdminInput
        label="Email"
        type="email"
        value={form.email}
        onChange={updateField("email")}
      />
      <AdminInput
        label="Password"
        type="password"
        value={form.password}
        onChange={updateField("password")}
      />
      <AdminInput
        label="Confirm Password"
        type="password"
        value={form.confirmPassword}
        onChange={updateField("confirmPassword")}
      />

      <button
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Instructor"}
      </button>
    </form>
  </AdminModal>
);
