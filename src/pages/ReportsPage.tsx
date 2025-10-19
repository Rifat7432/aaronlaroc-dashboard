import React, { useState } from "react";

interface Report {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "Completed" | "In Progress";
  color: string;
  icon: string;
}

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const reports: Report[] = [
    {
      id: 1,
      title: "Monthly User Report",
      description: "Comprehensive analysis of user activity for the past month",
      date: "October 2024",
      status: "Completed",
      color: "bg-green-100 text-green-800",
      icon: "📊",
    },
    {
      id: 2,
      title: "Revenue Analysis",
      description: "Quarterly revenue breakdown and financial insights",
      date: "Q3 2024",
      status: "Completed",
      color: "bg-blue-100 text-blue-800",
      icon: "💰",
    },
    {
      id: 3,
      title: "System Performance",
      description: "Server uptime and performance metrics report",
      date: "September 2024",
      status: "Completed",
      color: "bg-purple-100 text-purple-800",
      icon: "⚡",
    },
    {
      id: 4,
      title: "Customer Feedback",
      description: "Survey results and customer satisfaction ratings",
      date: "August 2024",
      status: "Completed",
      color: "bg-yellow-100 text-yellow-800",
      icon: "⭐",
    },
    {
      id: 5,
      title: "Security Audit",
      description:
        "Comprehensive security analysis and vulnerability assessment",
      date: "In Progress",
      status: "In Progress",
      color: "bg-orange-100 text-orange-800",
      icon: "🔒",
    },
    {
      id: 6,
      title: "Marketing Campaign",
      description: "ROI and engagement metrics for recent campaigns",
      date: "October 2024",
      status: "Completed",
      color: "bg-pink-100 text-pink-800",
      icon: "📈",
    },
  ];

  const handleReportClick = (report: Report): void => {
    setSelectedReport(report);
  };

  const handleCloseModal = (): void => {
    setSelectedReport(null);
  };

  const handleDownload = (): void => {
    console.log("Downloading report:", selectedReport?.title);
    // Add download logic here
  };

  const handleShare = (): void => {
    console.log("Sharing report:", selectedReport?.title);
    // Add share logic here
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-sky-900 mb-8 border-b border-gray-200 p-8">
        Recent
      </h1>
      <div className="space-y-6 p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-gray-600 text-sm mb-2">Total Reports</p>
            <p className="text-4xl font-bold text-sky-900 mb-2">10</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-gray-600 text-sm mb-2">In Progress</p>
            <p className="text-4xl font-bold text-sky-900 mb-2">08</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-gray-600 text-sm mb-2">Completed</p>
            <p className="text-4xl font-bold text-sky-900 mb-2">02</p>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Recent Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition duration-200 cursor-pointer"
                onClick={() => handleReportClick(report)}
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
                  <button className="text-sky-600 text-sm font-medium hover:text-sky-800">
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Report Modal */}
        {selectedReport && (
          <div
            className="fixed inset-0 bg-black/65 flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedReport.title}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedReport.description}</p>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Date:</span>{" "}
                  {selectedReport.date}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedReport.status}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-sky-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-800 transition duration-200"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
