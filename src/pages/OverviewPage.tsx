import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useGetAdminUserAnalysisQuery,
  useGetAdminUserStatsQuery,
} from "../redux/features/user/userApi";
import { storDashboardData } from "../redux/features/user/userSlice";
import { useAppDispatch } from "../redux/hooks/hooks";

type Period = "daily" | "monthly" | "yearly";

// Define different datasets for each time period

export default function OverviewPage() {
  const [period, setPeriod] = useState("daily");
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetAdminUserAnalysisQuery({
    type: period,
  });
  const { data: statsData, isLoading: isLoadingStats } =
    useGetAdminUserStatsQuery({
      type: period,
    });
  if (isLoading || isLoadingStats) {
    return <div className="p-8">Loading...</div>;
  }

  if (!data || !statsData) {
    return <div className="p-8">No data available</div>;
  }
  dispatch(
    storDashboardData({
      users: statsData.data.totalUsers,
      newUsers: statsData.data.newUsersLastNDays,
      totalReports: statsData.data.totalReports,
      newUsersPercent: statsData.data.newUsersPercent,
      currentMonthUsers: statsData.data.currentMonthUsers,
      activeUsersPercent: statsData.data.activeUsersPercent,
      inactiveUsers: statsData.data.inactiveUsers,
      inactiveUsersPercent: statsData.data.inactiveUsersPercent,
    })
  );

  const chartData: Record<Period, { name: string; users: number }[]> = {
    daily: data.daily,
    monthly: data.monthly,
    yearly: data.yearly,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-sky-900 mb-8">Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-600 text-sm mb-2">All Users</p>
          <p className="text-4xl font-bold text-sky-900 mb-2">{statsData.data.totalUsers}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-600 text-sm mb-2">New Users</p>
          <p className="text-4xl font-bold text-sky-900 mb-2">{statsData.data.newUsersLastNDays}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p className="text-gray-600 text-sm mb-2">Issues List</p>
          <p className="text-4xl font-bold text-sky-900 mb-2">{statsData.data.totalReports}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-8">
        {/* Users Analysis */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Users Analysis</h2>
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
          <ResponsiveContainer width="100%" height={300}>
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
  );
}
