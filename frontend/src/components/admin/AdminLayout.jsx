import { DashboardHeader, DashboardSidebar } from "../dashboard/DashboardShell";

const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "instructors", label: "Instructors", icon: "instructors" },
  { id: "users", label: "Users", icon: "users" },
];
const TITLES = { dashboard: "Dashboard", instructors: "Manage instructors", users: "Users" };

export const AdminSidebar = ({ activeTab, goTo, sidebarOpen, setSidebarOpen }) => <DashboardSidebar title="LearnHub Admin" subtitle="Administration" items={ITEMS} activeItem={activeTab} onSelect={goTo} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />;
export const AdminDesktopHeader = ({ activeTab, user, onOpenSidebar }) => <DashboardHeader title={TITLES[activeTab]} user={user} onOpenSidebar={onOpenSidebar} />;
