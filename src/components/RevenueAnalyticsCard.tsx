import React from "react";
import { Download, TrendingUp, DollarSign, Users } from "lucide-react";
import jsPDF from "jspdf";

export interface MonthlyEarningsData {
  month: number;
  totalEarnings: number;
  totalSubscriptions: number;
}

interface RevenueAnalyticsCardProps {
  data: MonthlyEarningsData[];
  onViewDetails?: (data: MonthlyEarningsData[]) => void;

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

const RevenueAnalyticsCard: React.FC<RevenueAnalyticsCardProps> = ({
  data,
  onViewDetails,

}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <p className="text-gray-500 text-center">No revenue data available</p>
      </div>
    );
  }

  // Calculate totals
  const totalEarnings = data.reduce((sum, item) => sum + (item.totalEarnings || 0), 0);
  const totalSubscriptions = data.reduce((sum, item) => sum + (item.totalSubscriptions || 0), 0);
  const averageEarningsPerSubscription = totalSubscriptions > 0 ? totalEarnings / totalSubscriptions : 0;

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(16);
      doc.setFont("Helvetica", "bold");
      doc.text("Revenue Analytics Report", 20, yPosition);
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

      // Summary Section
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Summary", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const summaryData = [
        ["Total Earnings", formatCurrency(totalEarnings)],
        ["Total Subscriptions", totalSubscriptions.toString()],
        ["Avg Earnings per Subscription", formatCurrency(averageEarningsPerSubscription)],
      ];

      summaryData.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, yPosition);
        doc.text(value, 110, yPosition, { align: "right" });
        yPosition += 6;
      });

      yPosition += 4;

      // Monthly Breakdown Section
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Monthly Breakdown", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");

      // Draw table headers
      const headers = ["Month", "Earnings", "Subscriptions", "Avg per Sub"];
      const columnWidths = [40, 50, 45, 55];
      let xPosition = 20;

      doc.setFont("Helvetica", "bold");
      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition, { align: index === 0 ? "left" : "right" });
        xPosition += columnWidths[index];
      });

      yPosition += 6;
      doc.setDrawColor(200);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 6;

      doc.setFont("Helvetica", "normal");

      // Draw table rows
      data.forEach((item) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }

        const monthName = getMonthName(item.month);
        const avgPerSub = item.totalSubscriptions > 0 ? item.totalEarnings / item.totalSubscriptions : 0;

        const row = [
          monthName,
          formatCurrency(item.totalEarnings),
          item.totalSubscriptions.toString(),
          formatCurrency(avgPerSub),
        ];

        let xPos = 20;
        row.forEach((cell, index) => {
          doc.text(cell, xPos, yPosition, {
            align: index === 0 ? "left" : "right",
          });
          xPos += columnWidths[index];
        });
        yPosition += 6;
      });

      // Footer
      doc.setFontSize(8);
      doc.setFont("Helvetica", "italic");
      doc.text("Aaron Laroc Dashboard • Revenue Analytics Monitor", 20, 280);

      // Save the PDF
      doc.save(`revenue-analytics-${new Date().toISOString().split("T")[0]}.pdf`);
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
            <TrendingUp size={24} className="text-white" />
            <div>
              <h3 className="text-lg font-bold text-white">Revenue Analytics</h3>
              <p className="text-sky-100 text-sm">
                {data.length} month{data.length !== 1 ? "s" : ""} of data
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-sky-900 px-3 py-2 rounded-lg transition text-sm font-semibold"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 border-b border-gray-200 bg-gray-50">
        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <DollarSign size={14} />
            Total Earnings
          </p>
          <p className="text-2xl font-bold text-sky-900">{formatCurrency(totalEarnings)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <Users size={14} />
            Total Subscriptions
          </p>
          <p className="text-2xl font-bold text-sky-900">{totalSubscriptions.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-600">Avg Earnings per Subscription</p>
          <p className="text-2xl font-bold text-sky-900">
            {formatCurrency(averageEarningsPerSubscription)}
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">Month</th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Earnings</th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Subscriptions</th>
              <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">Avg per Subscription</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const monthName = getMonthName(item.month);
              const avgPerSub = item.totalSubscriptions > 0 ? item.totalEarnings / item.totalSubscriptions : 0;
              return (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{monthName}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-900 font-semibold">
                    {formatCurrency(item.totalEarnings)}
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">
                    {item.totalSubscriptions.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">
                    {formatCurrency(avgPerSub)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
        <button
          onClick={() => onViewDetails?.(data)}
          className="text-sky-700 text-sm font-semibold hover:text-sky-900 transition"
        >
          View Full Report →
        </button>
      </div>
    </div>
  );
};

export default RevenueAnalyticsCard;
