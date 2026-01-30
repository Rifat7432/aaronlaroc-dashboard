import React from "react";
import { Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface UserData {
  _id: string;
  email: string;
  imgUrl: string;
  firstName: string;
  lastName: string;
}

interface ReportData {
  _id: string;
  problemtitle: string;
  desdetails: string;
  status: string;
  userID: UserData;
  createdAt: string;
  updatedAt: string;
}

interface UserReportCardProps {
  report: ReportData;
  onView?: (report: ReportData) => void;
}

const UserReportCard: React.FC<UserReportCardProps> = ({ report, onView }) => {
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "progress":
      case "in progress":
        return <Clock size={16} className="text-orange-500" />;
      case "completed":
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <AlertCircle size={16} className="text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "progress":
      case "in progress":
        return "bg-orange-100 text-orange-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* User Info Header */}
      <div className="bg-gradient-to-r from-sky-900 to-sky-700 p-4">
        <div className="flex items-center gap-3">
          <img
            src={report.userID.imgUrl  || "https://picsum.photos/40/40?seed=admin"}
            alt={`${report.userID.firstName} ${report.userID.lastName}`}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <div className="flex-1">
            <h3 className="text-white font-semibold">
              {report.userID.firstName} {report.userID.lastName}
            </h3>
            <p className="text-sky-100 text-sm">{report.userID.email}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Problem Title */}
        <div>
          <h4 className="font-semibold text-gray-900 text-lg leading-snug">
            {report.problemtitle}
          </h4>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-3">
          {report.desdetails}
        </p>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {getStatusIcon(report.status)}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              report.status
            )}`}
          >
            {report.status}
          </span>
        </div>

        {/* Date Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-100">
          <Calendar size={14} />
          <span>{formatDate(report.createdAt)}</span>
        </div>

        {/* IDs (for reference) */}
        <div className="space-y-1 text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
          <p>Report ID: {report._id.slice(0, 8)}...</p>
          <p>User ID: {report.userID._id.slice(0, 8)}...</p>
        </div>
      </div>

      {/* Action Button */}
      {onView && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onView(report)}
            className="w-full px-3 py-2 bg-sky-900 hover:bg-sky-800 text-white rounded-lg font-semibold text-sm transition"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default UserReportCard;
