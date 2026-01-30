import React from "react";
import { X, Download } from "lucide-react";
import jsPDF from "jspdf";

interface UserData {
  _id: string;
  email: string;
  imgUrl: string;
  firstName: string;
  lastName: string;
}

interface UserReportData {
  _id: string;
  problemtitle: string;
  desdetails: string;
  status: string;
  userID: UserData;
  createdAt: string;
  updatedAt: string;
}

interface MonthlyReportsModalProps {
  reports: UserReportData[];
  month: number;
  year: number;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

const MonthlyReportsModal: React.FC<MonthlyReportsModalProps> = ({
  reports,
  month,
  year,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const monthName = new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-900 to-sky-800 p-6 border-b border-sky-900">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {monthName} - User Reports
              </h2>
              <p className="text-sky-100 text-sm mt-1">
                Total: {reports.length} reports
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="bg-white hover:bg-sky-50 text-sky-900 p-2 rounded-lg transition flex items-center gap-2"
                title="Download PDF"
              >
                <Download size={18} />
                <span className="hidden sm:inline font-semibold text-sm">PDF</span>
              </button>
              <button
                onClick={onClose}
                className="text-sky-100 hover:text-white p-2"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reports found for {monthName}</p>
            </div>
          ) : (
            reports.map((report, index) => (
              <div
                key={report._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                {/* Report Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {index + 1}. {report.problemtitle}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-3">
                  {report.userID.imgUrl ? (
                    <img
                      src={report.userID.imgUrl}
                      alt={`${report.userID.firstName} ${report.userID.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-900 font-bold text-xs">
                      {report.userID.firstName.charAt(0)}
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">
                      {report.userID.firstName} {report.userID.lastName}
                    </p>
                    <p className="text-gray-600 text-xs">{report.userID.email}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-3 bg-gray-50 p-3 rounded">
                  {report.desdetails}
                </p>

                {/* Date Info */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Created: {formatDate(report.createdAt)}</span>
                  <span>Updated: {formatDate(report.updatedAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2 bg-sky-900 text-white rounded-lg font-semibold hover:bg-sky-800 transition flex items-center gap-2"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReportsModal;
