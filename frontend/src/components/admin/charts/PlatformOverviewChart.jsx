import { BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { PLATFORM_COLORS } from "../../../utils/adminHelpers";

export const PlatformOverviewChart = ({ data }) => (
  <div className="rounded-xl bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        <BarChart3 size={20} />
      </div>
      <div>
        <h2 className="font-semibold text-gray-900">Platform Overview</h2>
        <p className="text-sm text-gray-500">Overview of LMS statistics</p>
      </div>
    </div>

    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "none",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            cursor={{ fill: "rgba(59, 130, 246, 0.08)" }}
          />
          <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`platform-cell-${index}`}
                fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
