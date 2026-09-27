import { Users } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { STATUS_COLORS } from "../../../utils/adminHelpers";

export const UserStatusChart = ({ data }) => (
  <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
        <Users size={20} />
      </div>
      <div>
        <h2 className="font-semibold text-gray-900">User Status</h2>
        <p className="text-sm text-gray-500">Active and inactive users</p>
      </div>
    </div>

    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label labelLine={false}>
            {data.map((entry, index) => (
              <Cell key={`status-cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "none",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);
