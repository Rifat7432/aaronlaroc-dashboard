/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import RevenueChart from "../components/RevenueChart";
import { useState } from "react";
type Period = "daily" | "monthly" | "yearly";
const chartData: Record<Period, { name: string; users: number }[]> = {
  daily: [
    { name: "Mon", users: 120 },
    { name: "Tue", users: 180 },
    { name: "Wed", users: 150 },
    { name: "Thu", users: 220 },
    { name: "Fri", users: 280 },
    { name: "Sat", users: 190 },
    { name: "Sun", users: 160 },
  ],
  monthly: [
    { name: "Jan", users: 3200 },
    { name: "Feb", users: 2800 },
    { name: "Mar", users: 4100 },
    { name: "Apr", users: 3600 },
    { name: "May", users: 4500 },
    { name: "Jun", users: 5200 },
    { name: "Jul", users: 4800 },
    { name: "Aug", users: 5500 },
    { name: "Sep", users: 6100 },
    { name: "Oct", users: 5800 },
    { name: "Nov", users: 6400 },
    { name: "Dec", users: 7000 },
  ],
  yearly: [
    { name: "2019", users: 32000 },
    { name: "2020", users: 45000 },
    { name: "2021", users: 58000 },
    { name: "2022", users: 72000 },
    { name: "2023", users: 89000 },
    { name: "2024", users: 105000 },
  ],
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("daily");
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-sky-900 mb-8">Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="grid grid-cols-1 gap-6 mb-8">
          {" "}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-lg font-semibold text-sky-900 mb-2">New Users</p>
            <p className="text-4xl font-bold text-sky-900 mb-2">10</p>
            <p className="text-end text-sm font-semibold text-sky-900">
              <span className="text-green-600 text-sm font-semibold mr-2 bg-gray-100 p-[2px]">
                +15.10%
              </span>
              More than last month
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-lg font-semibold text-sky-900 mb-2">
              Active Users
            </p>
            <p className="text-4xl font-bold text-sky-900 mb-2">08</p>
            <p className="text-end text-sm font-semibold text-sky-900">
              <span className="text-green-600 text-sm font-semibold mr-2 bg-gray-100 p-[2px]">
                +15.10%
              </span>
              More than last month
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-lg font-semibold text-sky-900 mb-2">
              Inactive Users
            </p>
            <p className="text-4xl font-bold text-sky-900 mb-2">02</p>
            <p className="text-end text-sm font-semibold text-sky-900">
              <span className="text-green-600 text-sm font-semibold mr-2 bg-gray-100 p-[2px]">
                +15.10%
              </span>
              More than last month
            </p>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Users Analysis
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod("daily")}
                  className={`px-3 py-1 text-xs rounded font-semibold ${
                    period === "daily"
                      ? "bg-sky-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setPeriod("monthly")}
                  className={`px-3 py-1 text-xs rounded font-semibold ${
                    period === "monthly"
                      ? "bg-sky-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setPeriod("yearly")}
                  className={`px-3 py-1 text-xs rounded font-semibold ${
                    period === "yearly"
                      ? "bg-sky-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={410}>
              <LineChart data={chartData[`${period}` as Period]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                           <Tooltip
                  contentStyle={{
                    backgroundColor: "#bae6fd",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#024A71"
                  strokeWidth={2}
                  dot={{ fill: "#0066CC" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div>
        {/* Users Analysis */}

        {/* Revenue */}
        <RevenueChart />
      </div>
    </div>
  );
}
