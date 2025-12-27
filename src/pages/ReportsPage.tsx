import React, { useState } from "react";

type Category = "user" | "revenue" | "system";

interface Report {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "Completed" | "In Progress";
  color: string;
  icon: string;
  category: Category;
}

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("user");

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

  const handleDownload = () => {
    console.log("Downloading PDF:", selectedReport?.title);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-sky-900 mb-8 border-b border-gray-200 p-8">
        Reports
      </h1>

      <div className="p-8 space-y-8">
        {/* Category Tabs */}
        <div className="flex gap-3">
          {[
            { key: "user", label: "User Reports" },
            { key: "revenue", label: "Revenue Analytics" },
            { key: "system", label: "System Performance" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key as Category)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
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
        </div>

        {/* Modal */}
        {selectedReport && (
          <div
            className="fixed inset-0 bg-black/65 flex items-center justify-center z-50"
            onClick={() => setSelectedReport(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-2xl font-bold">
                  {selectedReport.title}
                </h3>
                <button
                  className="text-2xl text-gray-500"
                  onClick={() => setSelectedReport(null)}
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                {selectedReport.description}
              </p>

              <div className="space-y-2 mb-6">
                <p className="text-sm">
                  <strong>Date:</strong> {selectedReport.date}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {selectedReport.status}
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="w-full bg-sky-900 text-white py-2 rounded-lg font-semibold hover:bg-sky-800"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
