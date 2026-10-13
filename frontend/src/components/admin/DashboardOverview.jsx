import { useState } from "react";
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  UserPlus,
  Users,
  Wallet,
  CreditCard,
} from "lucide-react";

import { StatCard } from "./StatCard";
import { PlatformOverviewChart } from "./charts/PlatformOverviewChart";
import { UsersByRoleChart } from "./charts/UsersByRoleChart";
import { UserStatusChart } from "./charts/UserStatusChart";
import { RevenueTrendChart } from "./charts/RevenueTrendChart";
import {
  buildPlatformChartData,
  buildRoleChartData,
  buildStatusChartData,
} from "../../utils/adminHelpers";

const getRevenueDate = (period) => {
  const now = new Date();
  if (period === "year") return String(now.getFullYear());
  if (period === "month")
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export const DashboardOverview = ({
  analytics,
  onCreateInstructor,
  onViewUsers,
  onRefreshAnalytics,
}) => {
  const roleChartData = buildRoleChartData(analytics);
  const platformChartData = buildPlatformChartData(analytics);
  const statusChartData = buildStatusChartData(analytics);
  const [revenuePeriod, setRevenuePeriod] = useState("month");
  const [revenueDate, setRevenueDate] = useState(() => getRevenueDate("month"));
  const formatCurrency = ({ currency, amount }) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency.toUpperCase(),
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency.toUpperCase()} ${Number(amount).toLocaleString()}`;
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Overview</h2>
        <p className="mt-1 text-gray-500">Platform statistics and analytics</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={analytics?.totalUsers || 0}
          icon={<Users />}
        />
        <StatCard
          title="Students"
          value={analytics?.totalStudents || 0}
          icon={<GraduationCap />}
        />
        <StatCard
          title="Instructors"
          value={analytics?.totalInstructors || 0}
          icon={<ShieldCheck />}
        />
        <StatCard
          title="Courses"
          value={analytics?.totalCourses || 0}
          icon={<BookOpen />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PlatformOverviewChart data={platformChartData} />
        <UsersByRoleChart data={roleChartData} />
      </div>

      <UserStatusChart data={statusChartData} />
      <RevenueTrendChart data={analytics?.monthlyRevenueTrend || []} />

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Enrollments"
          value={analytics?.totalEnrollments || 0}
          icon={<BookOpen />}
        />
        <StatCard
          title="Active Users"
          value={analytics?.activeUsers || 0}
          icon={<Users />}
        />
        <StatCard
          title="Inactive Users"
          value={analytics?.inactiveUsers || 0}
          icon={<Users />}
        />
      </div>

      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Course revenue
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Revenue from payments confirmed by Stripe
            </p>
          </div>
          <CreditCard className="text-emerald-600" size={22} />
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label className="text-sm font-medium text-gray-700">
            View by
            <select
              value={revenuePeriod}
              onChange={(event) => {
                const period = event.target.value;
                setRevenuePeriod(period);
                const date = getRevenueDate(period);
                setRevenueDate(date);
                onRefreshAnalytics?.(period, date);
              }}
              className="mt-1 block rounded-lg border border-gray-300 bg-white px-3 py-2"
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">
            {revenuePeriod === "day"
              ? "Select day"
              : revenuePeriod === "year"
                ? "Select year"
                : "Select month"}
            <input
              type={
                revenuePeriod === "day"
                  ? "date"
                  : revenuePeriod === "year"
                    ? "number"
                    : "month"
              }
              min={revenuePeriod === "year" ? "2000" : undefined}
              max={
                revenuePeriod === "year"
                  ? String(new Date().getFullYear())
                  : undefined
              }
              value={revenueDate}
              onChange={(event) => {
                setRevenueDate(event.target.value);
                const isComplete =
                  revenuePeriod === "year"
                    ? /^\d{4}$/.test(event.target.value)
                    : revenuePeriod === "month"
                      ? /^\d{4}-(0[1-9]|1[0-2])$/.test(event.target.value)
                      : /^\d{4}-\d{2}-\d{2}$/.test(event.target.value);
                if (isComplete)
                  onRefreshAnalytics?.(revenuePeriod, event.target.value);
              }}
              className="mt-1 block rounded-lg border border-gray-300 bg-white px-3 py-2"
            />
          </label>
          <span className="pb-2 text-sm text-gray-500">
            {analytics?.selectedRevenue?.purchaseCount || 0} paid purchases
          </span>
        </div>
        <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">
            Selected {revenuePeriod} revenue ({revenueDate})
          </p>
          {analytics?.selectedRevenue?.byCurrency?.length ? (
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {analytics.selectedRevenue.byCurrency.map((item) => (
                <p
                  key={item.currency}
                  className="text-2xl font-bold text-emerald-950"
                >
                  {formatCurrency(item)}{" "}
                  <span className="text-sm font-medium text-emerald-800">
                    ({item.purchases} purchases)
                  </span>
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-2xl font-bold text-emerald-950">—</p>
          )}
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="rounded-lg bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-800">
              <Wallet size={16} /> Total paid revenue
            </div>
            {analytics?.revenueByCurrency?.length ? (
              <div className="mt-3 space-y-1">
                {analytics.revenueByCurrency.map((item) => (
                  <p
                    key={item.currency}
                    className="text-2xl font-bold text-emerald-950"
                  >
                    {formatCurrency(item)}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-2xl font-bold text-emerald-950">—</p>
            )}
          </div>
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">This month</p>
            {analytics?.monthlyRevenueByCurrency?.length ? (
              <div className="mt-3 space-y-1">
                {analytics.monthlyRevenueByCurrency.map((item) => (
                  <p
                    key={item.currency}
                    className="text-2xl font-bold text-blue-950"
                  >
                    {formatCurrency(item)}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-2xl font-bold text-blue-950">—</p>
            )}
            <p className="mt-2 text-xs text-blue-700">
              {analytics?.paidPurchaseCount || 0} paid course purchases overall
            </p>
          </div>
        </div>
      </section>

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
