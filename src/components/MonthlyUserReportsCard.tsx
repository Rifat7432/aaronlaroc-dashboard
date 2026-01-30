import React from "react";
import { Download, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";

export interface UserReportData {
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

interface MonthlyUserReportsCardProps {
  reports: UserReportData[];
  month: number;
  year: number;
  onViewDetails?: () => void;
  onDownload?: () => void;
}

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return <CheckCircle size={14} className="text-green-600" />;
    case "progress":
    case "in progress":
      return <Clock size={14} className="text-blue-600" />;
    default:
      return <AlertCircle size={14} className="text-yellow-600" />;
  }
};

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "progress":
    case "in progress":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const MonthlyUserReportsCard: React.FC<MonthlyUserReportsCardProps> = ({
  reports,
  month,
  year,
  onViewDetails,
  onDownload,
}) => {
  const monthName = new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const completedCount = reports.filter(
    (r) => r.status?.toLowerCase() === "completed"
  ).length;
  const progressCount = reports.filter(
    (r) =>
      r.status?.toLowerCase() === "progress" ||
      r.status?.toLowerCase() === "in progress"
  ).length;
  const pendingCount = reports.length - completedCount - progressCount;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 to-sky-800 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar size={24} className="text-white" />
            <div>
              <h3 className="text-white font-semibold text-lg">{monthName}</h3>
              <p className="text-sky-100 text-sm">Monthly Report Summary</p>
            </div>
          </div>
          {onDownload && (
            <button
              onClick={onDownload}
              className="bg-white hover:bg-sky-50 text-sky-900 p-2 rounded-lg transition"
              title="Download Monthly PDF"
            >
              <Download size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 p-3 h-36 rounded-lg border border-blue-200 text-center flex flex-col justify-center items-center">
            <p className="text-4xl font-bold text-blue-900">{reports.length}</p>
            <p className="text-md text-blue-700 font-semibold mt-1">Total Reports</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center flex flex-col justify-center items-center">
            <p className="text-3xl font-bold text-green-900">{completedCount}</p>
            <p className="text-md text-green-700 font-semibold mt-1">Completed</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-center flex flex-col justify-center items-center">
            <p className="text-4xl font-bold text-yellow-900">{pendingCount}</p>
            <p className="text-md text-yellow-700 font-semibold mt-1">Pending</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Status Breakdown</h4>
          <div className="space-y-2">
            {reports.slice(0, 5).map((report, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getStatusIcon(report.status)}
                  <span className="truncate text-gray-700">
                    {report.problemtitle}
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${getStatusColor(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>
            ))}
            {reports.length > 5 && (
              <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                +{reports.length - 5} more reports
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="w-64 px-3 py-2 bg-sky-900 hover:bg-sky-800 text-white rounded-lg font-semibold text-sm transition"
            >
              View All
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="w-64 px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1"
            >
              <Download size={14} />
              PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyUserReportsCard;
