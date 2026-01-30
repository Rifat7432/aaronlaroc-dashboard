import React, { useState, useMemo } from "react";
import { useGetAllReportsQuery, useGetSystemReportsQuery } from "../redux/features/reports/reportsApi";
import SystemPerformanceCard from "../components/SystemPerformanceCard";
import SystemPerformanceModal from "../components/SystemPerformanceModal";
import UserReportModal from "../components/UserReportModal";
import MonthlyUserReportsCard from "../components/MonthlyUserReportsCard";
import MonthlyReportsModal from "../components/MonthlyReportsModal";

interface UserReportData {
  _id: string;
  problemtitle: string;
  desdetails: string;
  status: string;
  userID: {
    _id: string;
    email: string;
    imgUrl: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Report {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "Completed" | "In Progress";
  color: string;
  icon: string;
  category: "user" | "revenue" | "system";
}

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<UserReportData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedSystemReport, setSelectedSystemReport] = useState<any>(null);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [showUserReportModal, setShowUserReportModal] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<{ month: number; year: number }>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [activeCategory, setActiveCategory] = useState<"user" | "revenue" | "system">("user");
  const { data } = useGetAllReportsQuery(undefined);
  const { data: systemData } = useGetSystemReportsQuery(undefined);

  // Group reports by month
  const monthlyReports = useMemo(() => {
    if (!data?.data) return {};

    const grouped: {
      [key: string]: {
        month: number;
        year: number;
        reports: UserReportData[];
      };
    } = {};

    data.data.forEach((report: UserReportData) => {
      const date = new Date(report.createdAt);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      if (!grouped[key]) {
        grouped[key] = { month, year, reports: [] };
      }
      grouped[key].reports.push(report);
    });

    return grouped;
  }, [data?.data]);

  // Get monthly reports in descending order (newest first)
  const sortedMonths = useMemo(() => {
    return Object.values(monthlyReports)
      .sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      });
  }, [monthlyReports]);
  const reports: Report[] = [
    {
      id: 1,
      title: "Monthly User Report",
      description: "Comprehensive analysis of user activity for the past month",
      date: "October 2024",
      status: "Completed",
      color: "bg-green-100 text-green-800",
      icon: "📊",
      category: "user",
    },
    {
      id: 2,
      title: "Revenue Analysis",
      description: "Quarterly revenue breakdown and financial insights",
      date: "Q3 2024",
      status: "Completed",
      color: "bg-blue-100 text-blue-800",
      icon: "💰",
      category: "revenue",
    },
    {
      id: 3,
      title: "System Performance",
      description: "Server uptime and performance metrics report",
      date: "September 2024",
      status: "Completed",
      color: "bg-purple-100 text-purple-800",
      icon: "⚡",
      category: "system",
    },
  ];

  const filteredReports = reports.filter(
    (report) => report.category === activeCategory
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-sky-900 mb-8 border-b border-gray-200 p-8">
        Reports
      </h1>

      <div className="p-8 space-y-8">
        {/* Category Tabs */}
        <div className="flex gap-3">
          {[
            { key: "user" as const, label: "User Reports" },
            { key: "revenue" as const, label: "Revenue Analytics" },
            { key: "system" as const, label: "System Performance" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeCategory === tab.key
                  ? "bg-sky-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reports Grid */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Available Reports
          </h3>

          {activeCategory === "user" && data?.data ? (
            <div className="grid grid-cols-1 gap-6">
              {sortedMonths.map((monthData) => (
                <MonthlyUserReportsCard
                  key={`${monthData.year}-${monthData.month}`}
                  reports={monthData.reports}
                  month={monthData.month}
                  year={monthData.year}
                  onViewDetails={() => {
                    setSelectedMonth({ month: monthData.month, year: monthData.year });
                    setShowMonthlyModal(true);
                  }}
                  onDownload={() => {
                    setSelectedMonth({ month: monthData.month, year: monthData.year });
                    setShowMonthlyModal(true);
                  }}
                />
              ))}
            </div>
          ) : activeCategory === "system" && systemData?.data ? (
            <div className="grid grid-cols-1 gap-6">
              <SystemPerformanceCard
                data={systemData.data}
                onViewDetails={(data) => {
                  setSelectedSystemReport(data);
                  setShowSystemModal(true);
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report: Report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report as unknown as UserReportData)}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{report.icon}</span>
                  <span
                    className={`${report.color} text-xs font-semibold px-3 py-1 rounded-full`}
                  >
                    {report.status}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  {report.title}
                </h4>

                <p className="text-gray-600 text-sm mb-3">
                  {report.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{report.date}</span>
                  <span className="text-sky-700 text-sm font-semibold">
                    PDF →
                  </span>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Monthly Reports Modal */}
        {showMonthlyModal && (
          <MonthlyReportsModal
            reports={monthlyReports[`${selectedMonth.year}-${selectedMonth.month}`]?.reports || []}
            month={selectedMonth.month}
            year={selectedMonth.year}
            isOpen={showMonthlyModal}
            onClose={() => {
              setShowMonthlyModal(false);
            }}
          />
        )}

        {/* User Report Modal */}
        {showUserReportModal && selectedReport && (
          <UserReportModal
            data={selectedReport}
            isOpen={showUserReportModal}
            onClose={() => {
              setShowUserReportModal(false);
              setSelectedReport(null);
            }}
          />
        )}

        {/* System Performance Modal */}
        <SystemPerformanceModal
          data={selectedSystemReport}
          isOpen={showSystemModal}
          onClose={() => {
            setShowSystemModal(false);
            setSelectedSystemReport(null);
          }}
        />
      </div>
    </div>
  );
};

export default ReportsPage;
