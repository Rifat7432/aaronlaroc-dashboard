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
import { useGetAdminUserAnalysisQuery } from "../redux/features/user/userApi";
import { useAppSelector } from "../redux/hooks/hooks";
type Period = "daily" | "monthly" | "yearly";
interface UserData {
  totalUsers: number;
  newUsers: number;
  lastMonthTotalUsers?: number; // Optional
  lastMonthNewUsers?: number; // Optional
}

function calculateUserMetrics(data: UserData) {
  const activeUsers = data.totalUsers - data.newUsers;
  const inactiveUsers =
    data.lastMonthTotalUsers !== undefined
      ? data.lastMonthTotalUsers - data.lastMonthNewUsers!
      : 0;

  const activeUsersIncrease =
    data.lastMonthTotalUsers !== undefined
      ? ((activeUsers -
          (data.lastMonthTotalUsers - (data.lastMonthNewUsers || 0))) /
          (data.lastMonthTotalUsers - (data.lastMonthNewUsers || 0))) *
        100
      : undefined;

  const newUsersIncrease =
    data.lastMonthNewUsers !== undefined
      ? ((data.newUsers - data.lastMonthNewUsers) / data.lastMonthNewUsers) *
        100
      : undefined;

  const inactiveUsersIncrease =
    data.lastMonthTotalUsers !== undefined
      ? ((inactiveUsers -
          (data.lastMonthTotalUsers - (data.lastMonthNewUsers || 0))) /
          (data.lastMonthTotalUsers - (data.lastMonthNewUsers || 0))) *
        100
      : undefined;

  return {
    activeUsers,
    inactiveUsers,
    activeUsersIncrease,
    newUsersIncrease,
    inactiveUsersIncrease,
  };
}

// Example usage with missing last month data

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("daily");
  const { newUsers, users } = useAppSelector(
    (state) => state.user.dashboardData
  );

  const { data, isLoading } = useGetAdminUserAnalysisQuery({
    type: period,
  });
  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!data) {
    return <div className="p-8">No data available</div>;
  }
  const chartData: Record<Period, { name: string; users: number }[]> = {
    daily: data.daily,
    monthly: data.monthly,
    yearly: data.yearly,
  };
  const userData: UserData = {
    totalUsers: users,
    newUsers,
    // lastMonthTotalUsers and lastMonthNewUsers are not provided
  };
  const metrics = calculateUserMetrics(userData);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-sky-900 mb-8">Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="grid grid-cols-1 gap-6 mb-8">
          {" "}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-lg font-semibold text-sky-900 mb-2">New Users</p>
            <p className="text-4xl font-bold text-sky-900 mb-2">{newUsers}</p>
            <p className="text-end text-sm font-semibold text-sky-900">
              <span className="text-green-600 text-sm font-semibold mr-2 bg-gray-100 p-[2px]">
                +{metrics.newUsersIncrease?.toFixed(2) || 0}%
              </span>
              More than last month
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-lg font-semibold text-sky-900 mb-2">
              Active Users
            </p>
            <p className="text-4xl font-bold text-sky-900 mb-2">
              {metrics.activeUsers}
            </p>
            <p className="text-end text-sm font-semibold text-sky-900">
              <span className="text-green-600 text-sm font-semibold mr-2 bg-gray-100 p-[2px]">
                +{metrics.activeUsersIncrease?.toFixed(2) || 0}%
              </span>
              More than last month
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-lg font-semibold text-sky-900 mb-2">
              Inactive Users
            </p>
            <p className="text-4xl font-bold text-sky-900 mb-2">
              {metrics.inactiveUsers}
            </p>
            <p className="text-end text-sm font-semibold text-sky-900">
              <span className="text-green-600 text-sm font-semibold mr-2 bg-gray-100 p-[2px]">
                +{metrics.inactiveUsersIncrease?.toFixed(2) || 0}%
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
