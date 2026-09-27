import { LayoutDashboard, Menu, UserPlus, Users, X } from "lucide-react";

export const SidebarButton = ({ icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
      active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`}
  >
    {icon}
    {text}
  </button>
);

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={19} /> },
  { id: "instructors", label: "Instructors", icon: <UserPlus size={19} /> },
  { id: "users", label: "Users", icon: <Users size={19} /> },
];

export const AdminSidebar = ({ activeTab, goTo, sidebarOpen, setSidebarOpen }) => (
  <aside
    className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white transition-transform lg:translate-x-0 ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <div className="flex h-16 items-center justify-between border-b border-gray-700 px-5">
      <h1 className="text-xl font-bold">LearnHub Admin</h1>
      <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
        <X />
      </button>
    </div>

    <div className="p-4">
      <p className="mb-6 text-xs uppercase text-gray-400">Administration</p>

      {NAV_ITEMS.map((item) => (
        <SidebarButton
          key={item.id}
          icon={item.icon}
          text={item.label}
          active={activeTab === item.id}
          onClick={() => goTo(item.id)}
        />
      ))}
    </div>
  </aside>
);

export const AdminMobileHeader = ({ onOpenSidebar }) => (
  <div className="flex items-center justify-between border-b bg-white px-4 py-4 lg:hidden">
    <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
    <button onClick={onOpenSidebar} className="rounded-lg p-2 hover:bg-gray-100">
      <Menu />
    </button>
  </div>
);

const TAB_TITLES = {
  dashboard: "Dashboard",
  instructors: "Manage Instructors",
  users: "Users",
};

export const AdminDesktopHeader = ({ activeTab, user }) => (
  <header className="hidden items-center justify-between border-b bg-white px-8 py-5 lg:flex">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{TAB_TITLES[activeTab]}</h1>
      <p className="mt-1 text-sm text-gray-500">Welcome, {user?.fullname}</p>
    </div>
  </header>
);
