export const PLATFORM_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];
export const ROLE_COLORS = [
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];
export const STATUS_COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];

export const buildRoleChartData = (analytics) => [
  { name: "Students", value: analytics?.totalStudents || 0 },
  { name: "Instructors", value: analytics?.totalInstructors || 0 },
  { name: "Admins", value: analytics?.totalAdmins || 0 },
];

export const buildPlatformChartData = (analytics) => [
  { name: "Users", value: analytics?.totalUsers || 0 },
  { name: "Students", value: analytics?.totalStudents || 0 },
  { name: "Instructors", value: analytics?.totalInstructors || 0 },
  { name: "Courses", value: analytics?.totalCourses || 0 },
  { name: "Enrollments", value: analytics?.totalEnrollments || 0 },
];

export const buildStatusChartData = (analytics) => [
  { name: "Active", value: analytics?.activeUsers || 0 },
  { name: "Inactive", value: analytics?.inactiveUsers || 0 },
];
