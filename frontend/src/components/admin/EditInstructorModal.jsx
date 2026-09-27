import { AdminModal, AdminInput } from "./AdminModal";

export const EditInstructorModal = ({ onClose, onSubmit, form, updateField, loading }) => (
  <AdminModal title="Update Instructor" onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <AdminInput label="Full Name" value={form.fullname} onChange={updateField("fullname")} />
      <AdminInput label="Username" value={form.username} onChange={updateField("username")} />
      <AdminInput label="Email" type="email" value={form.email} onChange={updateField("email")} />

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label="CNIC" value={form.cnic} onChange={updateField("cnic")} />
        <AdminInput label="Contact" value={form.contactno} onChange={updateField("contactno")} />
        <AdminInput label="District" value={form.district} onChange={updateField("district")} />
        <AdminInput label="Tehsil" value={form.tehsil} onChange={updateField("tehsil")} />
      </div>

      <AdminInput label="Address" value={form.address} onChange={updateField("address")} />

      <div>
        <label className="mb-1 block text-sm font-medium">Bio</label>
        <textarea
          value={form.bio}
          onChange={updateField("bio")}
          rows={4}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <button
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Instructor"}
      </button>
    </form>
  </AdminModal>
);

