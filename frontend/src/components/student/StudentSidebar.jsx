import { DashboardSidebar } from "../dashboard/DashboardShell";

const ITEMS = [
  { id: "courses", label: "My courses", icon: "courses" },
  { id: "content", label: "Course content", icon: "content" },
  { id: "assignments", label: "Assignments", icon: "assignments" },
  { id: "chat", label: "Course chat", icon: "chat" },
];

const StudentSidebar = ({ activeView, goTo, sidebarOpen, setSidebarOpen, courseCount }) => {
  const items = ITEMS.map((item) => ({ ...item, disabled: item.id !== "courses" && courseCount === 0, badge: item.id === "courses" ? courseCount : undefined }));
  return <DashboardSidebar title="LearnHub" subtitle="Student learning space" items={items} activeItem={activeView} onSelect={goTo} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />;
};

export default StudentSidebar;
