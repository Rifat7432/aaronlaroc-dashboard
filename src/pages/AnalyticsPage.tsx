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
import { useGetAdminUserAnalysisQuery, useGetAdminUserStatsQuery } from "../redux/features/user/userApi";
import Loader from "../components/Loader";

type Period = "daily" | "monthly" | "yearly";

// Example usage with missing last month data

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("daily");


  const { data, isLoading } = useGetAdminUserAnalysisQuery({
    type: period,
  });
    const { data: statsData, isLoading: isLoadingStats } =
      useGetAdminUserStatsQuery({
        type: period,
      });
  if (isLoading || isLoadingStats) {
    return <Loader />;
  }

  if (!data) {
    return <div className="p-8">No data available</div>;
  }
  const chartData: Record<Period, { name: string; users: number }[]> = {
    daily: data.daily,
    monthly: data.monthly,
    yearly: data.yearly,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-sky-900 mb-8">Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="grid grid-cols-1 gap-6 mb-8">
          {" "}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-lg font-semibold text-sky-900 mb-2">New Users</p>
            <p className="text-4xl font-bold text-sky-900 mb-2">{statsData.data.newUsers}</p>
            <p className="text-end text-sm font-semibold text-sky-900">
              <span className={`${statsData.data.newUsersPercent < 0 ? "text-red-600" : "text-green-600"} text-sm font-semibold mr-2 bg-gray-100 p-[2px]`}>
                {statsData.data.newUsersPercent}%
              </span>
              More than last month
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-lg font-semibold text-sky-900 mb-2">
              Active Users
            </p>
            <p className="text-4xl font-bold text-sky-900 mb-2">
              {statsData.data.totalUsers - statsData.data.inactiveUsers}
            </p>
            <p className="text-end text-sm font-semibold text-sky-900">
              <span
                className={`${statsData.data.activeUsersPercent < 0 ? "text-red-600" : "text-green-600"} text-sm font-semibold mr-2 bg-gray-100 p-[2px]`}
              >
                {statsData.data.activeUsersPercent}%
              </span>
              More than last month
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-lg font-semibold text-sky-900 mb-2">
              Inactive Users
            </p>
            <p className="text-4xl font-bold text-sky-900 mb-2">
              {statsData.data.inactiveUsers}
            </p>
            <p className="text-end text-sm font-semibold text-sky-900">
              <span className={`${statsData.data.inactiveUsersPercent < 0 ? "text-red-600" : "text-green-600"} text-sm font-semibold mr-2 bg-gray-100 p-[2px]`}>
                {statsData.data.inactiveUsersPercent}%
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
