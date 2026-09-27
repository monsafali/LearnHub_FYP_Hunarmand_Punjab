import { BookOpen, GraduationCap, ShieldCheck, UserPlus, Users } from "lucide-react";

import { StatCard } from "./StatCard";
import { PlatformOverviewChart } from "./charts/PlatformOverviewChart";
import { UsersByRoleChart } from "./charts/UsersByRoleChart";
import { UserStatusChart } from "./charts/UserStatusChart";
import {
  buildPlatformChartData,
  buildRoleChartData,
  buildStatusChartData,
} from "../../utils/adminHelpers";

export const DashboardOverview = ({ analytics, onCreateInstructor, onViewUsers }) => {
  const roleChartData = buildRoleChartData(analytics);
  const platformChartData = buildPlatformChartData(analytics);
  const statusChartData = buildStatusChartData(analytics);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="mt-1 text-gray-500">Platform statistics and analytics</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={analytics?.totalUsers || 0} icon={<Users />} />
        <StatCard title="Students" value={analytics?.totalStudents || 0} icon={<GraduationCap />} />
        <StatCard title="Instructors" value={analytics?.totalInstructors || 0} icon={<ShieldCheck />} />
        <StatCard title="Courses" value={analytics?.totalCourses || 0} icon={<BookOpen />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PlatformOverviewChart data={platformChartData} />
        <UsersByRoleChart data={roleChartData} />
      </div>

      <UserStatusChart data={statusChartData} />

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Enrollments" value={analytics?.totalEnrollments || 0} icon={<BookOpen />} />
        <StatCard title="Active Users" value={analytics?.activeUsers || 0} icon={<Users />} />
        <StatCard title="Inactive Users" value={analytics?.inactiveUsers || 0} icon={<Users />} />
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Quick Actions</h2>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={onCreateInstructor}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <UserPlus size={18} />
            Create Instructor
          </button>

          <button
            onClick={onViewUsers}
            className="flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium hover:bg-gray-50"
          >
            <Users size={18} />
            View Users
          </button>
        </div>
      </div>
    </>
  );
};
