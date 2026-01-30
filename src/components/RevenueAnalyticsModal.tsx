import React from "react";
import { X, Download, TrendingUp, DollarSign, Users } from "lucide-react";
import jsPDF from "jspdf";

export interface MonthlyEarningsData {
  month: number;
  totalEarnings: number;
  totalSubscriptions: number;
}

interface RevenueAnalyticsModalProps {
  data: MonthlyEarningsData[] | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

const getMonthName = (month: number): string => {
  return new Date(2024, month - 1).toLocaleDateString("en-US", {
    month: "long",
  });
};

const RevenueAnalyticsModal: React.FC<RevenueAnalyticsModalProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !data) return null;

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(18);
      doc.setFont("Helvetica", "bold");
      doc.text("Revenue Analytics Report - Detailed", 20, yPosition);
      yPosition += 10;

      // Generated date
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
      yPosition += 8;

      // Divider
      doc.setDrawColor(200);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;

      // Executive Summary
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Executive Summary", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const totalEarnings = data.reduce((sum, item) => sum + item.totalEarnings, 0);
      const totalSubscriptions = data.reduce(
        (sum, item) => sum + item.totalSubscriptions,
        0
      );
      const avgEarningsPerSub =
        totalSubscriptions > 0 ? totalEarnings / totalSubscriptions : 0;

      doc.text(`Total Earnings: ${formatCurrency(totalEarnings)}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Total Subscriptions: ${totalSubscriptions}`, 20, yPosition);
      yPosition += 6;
      doc.text(
        `Avg Earnings per Subscription: ${formatCurrency(avgEarningsPerSub)}`,
        20,
        yPosition
      );
      yPosition += 8;

      // Monthly Breakdown Section
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Monthly Breakdown", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");

      // Create table data
      const tableData = data.map((item) => {
        const monthName = getMonthName(item.month);
        const avgPerSub =
          item.totalSubscriptions > 0
            ? item.totalEarnings / item.totalSubscriptions
            : 0;
        return [
          monthName,
          formatCurrency(item.totalEarnings),
          item.totalSubscriptions.toString(),
          formatCurrency(avgPerSub),
        ];
      });

      // Draw table headers
      const headers = ["Month", "Earnings", "Subscriptions", "Avg per Subscription"];
      const columnWidths = [40, 50, 45, 55];
      let xPosition = 20;

      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition, { align: "right" });
        xPosition += columnWidths[index];
      });

      yPosition += 6;
      doc.setDrawColor(200);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 6;

      // Draw table rows
      tableData.forEach((row) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }

        let xPos = 20;
        row.forEach((cell, index) => {
          doc.text(cell, xPos, yPosition, {
            align: index === 0 ? "left" : "right",
          });
          xPos += columnWidths[index];
        });
        yPosition += 6;
      });

      yPosition += 4;

      // Summary Statistics
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Summary Statistics", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const summaryData = [
        ["Number of Months", data.length.toString()],
        ["Total Earnings", formatCurrency(totalEarnings)],
        ["Total Subscriptions", totalSubscriptions.toString()],
        ["Average Earnings per Subscription", formatCurrency(avgEarningsPerSub)],
        [
          "Average Monthly Earnings",
          formatCurrency(totalEarnings / (data.length || 1)),
        ],
        [
          "Average Monthly Subscriptions",
          Math.round(totalSubscriptions / (data.length || 1)).toString(),
        ],
      ];

      summaryData.forEach(([label, value]) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`${label}:`, 20, yPosition);
        doc.text(value, 110, yPosition, { align: "right" });
        yPosition += 6;
      });

      // Footer
      doc.setFontSize(8);
      doc.setFont("Helvetica", "italic");
      doc.text("Aaron Laroc Dashboard • Revenue Analytics Monitor", 20, 280);

      // Save the PDF
      doc.save(
        `revenue-analytics-detailed-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const totalEarnings = data.reduce((sum, item) => sum + item.totalEarnings, 0);
  const totalSubscriptions = data.reduce(
    (sum, item) => sum + item.totalSubscriptions,
    0
  );
  const avgEarningsPerSub =
    totalSubscriptions > 0 ? totalEarnings / totalSubscriptions : 0;

  return (
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-900 to-sky-800 p-6 border-b border-sky-900">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Revenue Analytics Report
              </h2>
              <p className="text-sky-100 text-sm mt-1">
                Detailed earnings and subscription insights
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="bg-white hover:bg-sky-50 text-sky-900 p-2 rounded-lg transition flex items-center gap-2"
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
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200">
              <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                <DollarSign size={14} />
                Total Earnings
              </p>
              <p className="text-3xl font-bold text-sky-900">
                {formatCurrency(totalEarnings)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200">
              <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                <Users size={14} />
                Total Subscriptions
              </p>
              <p className="text-3xl font-bold text-sky-900">
                {totalSubscriptions.toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200">
              <p className="text-sm text-gray-600 mb-2">
                Avg per Subscription
              </p>
              <p className="text-2xl font-bold text-sky-900">
                {formatCurrency(avgEarningsPerSub)}
              </p>
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-sky-900" />
              Monthly Breakdown
            </h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-sky-50 to-sky-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Month
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Earnings
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Subscriptions
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Avg per Sub
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const monthName = getMonthName(item.month);
                    const avgPerSub =
                      item.totalSubscriptions > 0
                        ? item.totalEarnings / item.totalSubscriptions
                        : 0;
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {monthName}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900 font-semibold">
                          {formatCurrency(item.totalEarnings)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {item.totalSubscriptions.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600 font-medium">
                          {formatCurrency(avgPerSub)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2">
                  Average Monthly Earnings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalEarnings / (data.length || 1))}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2">
                  Average Monthly Subscriptions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(totalSubscriptions / (data.length || 1))}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2">
                  Number of Months
                </p>
                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2">
                  Report Generated
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
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
            className="px-6 py-2 bg-sky-800 hover:bg-sky-700 text-white rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Download size={18} />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalyticsModal;
