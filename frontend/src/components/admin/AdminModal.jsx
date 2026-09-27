import { X } from "lucide-react";

export const AdminModal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
          <X size={20} />
        </button>
      </div>

      <div className="p-6">{children}</div>
    </div>
  </div>
);

export const AdminInput = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
    />
  </div>
);
