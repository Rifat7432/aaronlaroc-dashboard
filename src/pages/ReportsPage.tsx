import React, { useState, useMemo } from "react";
import {
  useGetAllReportsQuery,
  useGetMonthlyEarningsStatsQuery,
  useGetSystemReportsQuery,
} from "../redux/features/reports/reportsApi";
import SystemPerformanceCard from "../components/SystemPerformanceCard";
import SystemPerformanceModal from "../components/SystemPerformanceModal";
import UserReportModal from "../components/UserReportModal";
import MonthlyUserReportsCard from "../components/MonthlyUserReportsCard";
import MonthlyReportsModal from "../components/MonthlyReportsModal";
import RevenueAnalyticsCard from "../components/RevenueAnalyticsCard";
import RevenueAnalyticsModal from "../components/RevenueAnalyticsModal";
import Loader from "../components/Loader";

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


const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<UserReportData | null>(
    null,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedSystemReport, setSelectedSystemReport] = useState<any>(null);
  const [showSystemModal, setShowSystemModal] = useState(false);
  const [showUserReportModal, setShowUserReportModal] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<{
    month: number;
    year: number;
  }>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [activeCategory, setActiveCategory] = useState<
    "user" | "revenue" | "system"
  >("user");
  const { data } = useGetAllReportsQuery(undefined);
  const { data: systemData } = useGetSystemReportsQuery(undefined);
  const { data: monthlyEarningsData } =
    useGetMonthlyEarningsStatsQuery(undefined);

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
    return Object.values(monthlyReports).sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [monthlyReports]);
 
if(!data && !systemData && !monthlyEarningsData){
  return <Loader/>
}
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
                    setSelectedMonth({
                      month: monthData.month,
                      year: monthData.year,
                    });
                    setShowMonthlyModal(true);
                  }}
                  onDownload={() => {
                    setSelectedMonth({
                      month: monthData.month,
                      year: monthData.year,
                    });
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
          ) : activeCategory === "revenue" && monthlyEarningsData?.data ? (
            <div className="grid grid-cols-1 gap-6">
              <RevenueAnalyticsCard
                data={monthlyEarningsData.data}
                onViewDetails={() => {
                  setShowRevenueModal(true);
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>

        {/* Monthly Reports Modal */}
        {showMonthlyModal && (
          <MonthlyReportsModal
            reports={
              monthlyReports[`${selectedMonth.year}-${selectedMonth.month}`]
                ?.reports || []
            }
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

        {/* Revenue Analytics Modal */}
        <RevenueAnalyticsModal
          data={monthlyEarningsData?.data || null}
          isOpen={showRevenueModal}
          onClose={() => {
            setShowRevenueModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default ReportsPage;
