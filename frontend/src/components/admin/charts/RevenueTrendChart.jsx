import { useMemo } from "react";
import { Activity } from "lucide-react";
import {
  CartesianGrid,
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#059669", "#2563eb", "#d97706", "#7c3aed", "#db2777"];

const formatCurrency = (currency, amount) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${Number(amount).toLocaleString()}`;
  }
};

export const RevenueTrendChart = ({ data = [] }) => {
  const { chartData, currencies } = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth() + 1}`,
        month: date.toLocaleDateString(undefined, { month: "short", year: "2-digit" }),
      };
    });
    const codes = [...new Set(data.map((entry) => entry.currency).filter(Boolean))].sort();
    const byMonth = new Map(months.map(({ key, month }) => [key, { month }]));

    for (const entry of data) {
      const row = byMonth.get(`${entry.year}-${entry.month}`);
      if (row) row[entry.currency] = entry.amount;
    }

    return { chartData: [...byMonth.values()], currencies: codes };
  }, [data]);

  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><Activity size={20} /></div>
        <div>
          <h2 className="font-semibold text-gray-900">Revenue over time</h2>
          <p className="text-sm text-gray-500">Monthly revenue from Stripe confirmed payments, by currency</p>
        </div>
      </div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={(value) => Number(value).toLocaleString()} />
            <Tooltip
              formatter={(value, name) => [formatCurrency(name, value), name.toUpperCase()]}
              contentStyle={{ backgroundColor: "#ffffff", border: "none", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
            <Legend formatter={(value) => value.toUpperCase()} />
            {currencies.map((currency, index) => (
              <Bar key={currency} dataKey={currency} name={currency} fill={COLORS[index % COLORS.length]} radius={[5, 5, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {!currencies.length && <p className="-mt-8 text-center text-sm text-gray-500">No confirmed revenue in the last 12 months yet.</p>}
    </section>
  );
};
