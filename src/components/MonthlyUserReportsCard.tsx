import React from "react";
import { Download, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import jsPDF from "jspdf";

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
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(18);
      doc.setFont("Helvetica", "bold");
      doc.text(`Monthly User Reports - ${monthName}`, 20, yPosition);
      yPosition += 10;

      // Generated date
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
      doc.text(`Total Reports: ${reports.length}`, 120, yPosition);
      yPosition += 8;

      // Divider
      doc.setDrawColor(200);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;

      // Summary Statistics
      const completedCount = reports.filter(
        (r) => r.status?.toLowerCase() === "completed"
      ).length;
      const progressCount = reports.filter(
        (r) =>
          r.status?.toLowerCase() === "progress" ||
          r.status?.toLowerCase() === "in progress"
      ).length;
      const pendingCount = reports.length - completedCount - progressCount;

      doc.setFontSize(11);
      doc.setFont("Helvetica", "bold");
      doc.text("Summary Statistics", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const summaryData = [
        ["Total Reports", reports.length.toString()],
        ["Completed", completedCount.toString()],
        ["In Progress", progressCount.toString()],
        ["Pending", pendingCount.toString()],
      ];

      summaryData.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, yPosition);
        doc.text(value, 120, yPosition);
        yPosition += 5;
      });

      yPosition += 5;

      // Detailed Reports
      doc.setFontSize(11);
      doc.setFont("Helvetica", "bold");
      doc.text("Detailed Reports", 20, yPosition);
      yPosition += 6;

      // Report entries
      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");

      reports.forEach((report, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Report number
        doc.setFont("Helvetica", "bold");
        doc.text(`Report ${index + 1}:`, 20, yPosition);
        yPosition += 4;

        // Problem title
        doc.setFont("Helvetica", "normal");
        doc.text("Problem:", 20, yPosition);
        const titleLines = doc.splitTextToSize(report.problemtitle, 160);
        doc.text(titleLines, 50, yPosition);
        yPosition += Math.max(4, titleLines.length * 3) + 2;

        // User info
        doc.text("User:", 20, yPosition);
        doc.text(`${report.userID.firstName} ${report.userID.lastName}`, 50, yPosition);
        yPosition += 4;
        doc.text("Email:", 20, yPosition);
        doc.text(report.userID.email, 50, yPosition);
        yPosition += 4;

        // Status
        doc.text("Status:", 20, yPosition);
        doc.text(report.status, 50, yPosition);
        yPosition += 4;

        // Dates
        doc.text("Created:", 20, yPosition);
        doc.text(formatDate(report.createdAt), 50, yPosition);
        yPosition += 4;

        // Description
        doc.setFont("Helvetica", "bold");
        doc.text("Description:", 20, yPosition);
        yPosition += 3;

        doc.setFont("Helvetica", "normal");
        const descLines = doc.splitTextToSize(report.desdetails, 160);
        doc.text(descLines, 20, yPosition);
        yPosition += descLines.length * 3 + 4;

        // Separator
        doc.setDrawColor(220);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 6;
      });

      // Footer
      yPosition = 270;
      doc.setFontSize(8);
      doc.setFont("Helvetica", "italic");
      doc.setTextColor(128);
      doc.text(
        "Aaron Laroc Dashboard • Monthly User Reports",
        20,
        yPosition
      );
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        20,
        280
      );

      // Save PDF
      doc.save(`monthly-user-reports-${year}-${String(month).padStart(2, "0")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
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
       
            <button
              onClick={handleDownloadPDF}
              className="bg-white hover:bg-sky-50 text-sky-900 p-2 rounded-lg transition"
              title="Download Monthly PDF"
            >
              <Download size={18} />
            </button>
      
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
