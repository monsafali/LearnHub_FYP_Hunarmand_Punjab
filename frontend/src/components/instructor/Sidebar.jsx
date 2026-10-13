import { DashboardSidebar } from "../dashboard/DashboardShell";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "dashboard" },
  { id: "courses", label: "My courses", icon: "courses" },
  { id: "assignments", label: "Assignments", icon: "assignments" },
  { id: "students", label: "Students", icon: "students" },
];

export const Sidebar = ({ activeView, goTo, sidebarOpen, setSidebarOpen, courseCount }) => {
  const items = NAV_ITEMS.map((item) => item.id === "courses" ? { ...item, badge: courseCount } : item);
  return <DashboardSidebar title="LearnHub" subtitle="Instructor studio" items={items} activeItem={activeView} onSelect={goTo} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />;
};
