import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";

interface RevenueData {
  month: string;
  revenue: number;
}

interface ProfitData {
  month: string;
  profit: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: RevenueData;
}

const revenueData: RevenueData[] = [
  { month: "Jan", revenue: 65000 },
  { month: "Feb", revenue: 78000 },
  { month: "Mar", revenue: 72000 },
  { month: "Apr", revenue: 85000 },
  { month: "May", revenue: 92000 },
  { month: "Jun", revenue: 88000 },
  { month: "Jul", revenue: 95000 },
  { month: "Aug", revenue: 86500 },
];

const profitData: ProfitData[] = [
  { month: "Jan", profit: 82000 },
  { month: "Feb", profit: 78000 },
  { month: "Mar", profit: 88000 },
  { month: "Apr", profit: 85000 },
  { month: "May", profit: 92000 },
  { month: "Jun", profit: 87000 },
  { month: "Jul", profit: 95000 },
  { month: "Aug", profit: 91000 },
];

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3">
        <p className="text-sm text-gray-700">
          <span className="font-bold text-gray-800">
            ${payload[0].value.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomDot: React.FC<CustomDotProps> = (props) => {
  const { cx, cy, payload } = props;

  if (!cx || !cy || !payload) return null;

  if (payload.month === "Aug") {
    return (
      <g>
        <rect
          x={cx - 20}
          y={cy - 60}
          width={60}
          height={45}
          fill="#F3F4F6"
          stroke="#E5E7EB"
          strokeWidth={1}
          rx={4}
        />
        <text
          x={cx + 10}
          y={cy - 35}
          textAnchor="middle"
          fill="#1F2937"
          fontSize="14"
          fontWeight="600"
        >
          ${(payload.revenue / 1000).toFixed(1)}k
        </text>
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="#8B5CF6"
          stroke="#fff"
          strokeWidth={2}
        />
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - 15}
          stroke="#8B5CF6"
          strokeWidth={2}
        />
      </g>
    );
  }

  return null;
};

const RevenueChart: React.FC = () => {
  return (
    <div className="">
       <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-sky-900 mb-2">Revenue</h2>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-gray-900">$120,544</p>
              <p className="text-gray-500 text-sm font-semibold">
                from $180,000
              </p>
            </div>

            <p className="text-gray-500 font-semibold text-lg text-end">
              <span className="text-green-600">3.5%</span> <br />
              Overall profit
            </p>
          </div>

        {/* Charts Container */}
        <div className="flex gap-4">
          {/* Left Chart - Area Chart */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F3F4F6"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fill="url(#colorRevenue)"
                  dot={<CustomDot />}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Right Chart - Dashed Line Chart */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={profitData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F3F4F6"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
