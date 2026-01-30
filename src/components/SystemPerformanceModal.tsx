import React from "react";
import { X, Download, AlertCircle, TrendingUp } from "lucide-react";
import jsPDF from "jspdf";

interface MemoryStats {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
}

interface CpuStats {
  user: number;
  system: number;
}

interface SystemPerformanceData {
  memory: MemoryStats;
  cpu: CpuStats;
  uptime: string;
  timestamp: string;
  meta: {
    totalErrors: number;
    timestamp: string;
  };
}

interface SystemPerformanceModalProps {
  data: SystemPerformanceData | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getMemoryUsagePercentage = (used: number, total: number): number => {
  return Math.round((used / total) * 100);
};

const SystemPerformanceModal: React.FC<SystemPerformanceModalProps> = ({
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
      doc.text("System Performance Report - Detailed", 20, yPosition);
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
      doc.text(
        `Status: ${data.meta?.totalErrors > 0 ? "WARNING - Errors Detected" : "System Healthy"}`,
        20,
        yPosition
      );
      yPosition += 6;
      doc.text(`Uptime: ${data.uptime}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Total Errors: ${data.meta?.totalErrors}`, 20, yPosition);
      yPosition += 8;

      // Memory Statistics
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Memory Statistics", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const memoryData = [
        ["RSS Memory", formatBytes(data.memory.rss)],
        ["Heap Total", formatBytes(data.memory.heapTotal)],
        ["Heap Used", formatBytes(data.memory.heapUsed)],
        ["Heap Usage", `${getMemoryUsagePercentage(data.memory.heapUsed, data.memory.heapTotal)}%`],
        ["Available", formatBytes(data.memory.heapTotal - data.memory.heapUsed)],
        ["External Memory", formatBytes(data.memory.external)],
      ];

      memoryData.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, yPosition);
        doc.text(value, 110, yPosition, { align: "right" });
        yPosition += 6;
      });

      yPosition += 4;

      // CPU Statistics
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("CPU Statistics", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const cpuData = [
        ["User CPU Time", `${data.cpu.user}ms`],
        ["System CPU Time", `${data.cpu.system}ms`],
        ["Total CPU Time", `${data.cpu.user + data.cpu.system}ms`],
      ];

      cpuData.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, yPosition);
        doc.text(value, 110, yPosition, { align: "right" });
        yPosition += 6;
      });

      yPosition += 4;

      // System Information
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("System Information", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const systemData = [
        ["Uptime", data.uptime],
        ["Total Errors", data.meta?.totalErrors.toString() || "0"],
        ["Report Generated", new Date(data.meta?.timestamp).toLocaleString()],
        ["Snapshot Time", new Date(data.timestamp).toLocaleString()],
      ];

      systemData.forEach(([label, value]) => {
        if (yPosition > 260) {
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
      doc.text("Aaron Laroc Dashboard • System Performance Monitor", 20, 280);

      // Save the PDF
      doc.save(`system-performance-detailed-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-900 to-sky-800 p-6 border-b border-sky-900">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                System Performance Report
              </h2>
              <p className="text-sky-100 text-sm mt-1">
                Real-time monitoring dashboard
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
          {/* Status Alert */}
          <div className={`flex gap-3 p-4 rounded-lg border ${
            data.meta?.totalErrors > 0
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}>
            <AlertCircle
              size={20}
              className={data.meta?.totalErrors > 0 ? "text-red-600" : "text-green-600"}
            />
            <div>
              <p className={`font-semibold ${
                data.meta?.totalErrors > 0 ? "text-red-900" : "text-green-900"
              }`}>
                {data.meta?.totalErrors > 0
                  ? `${data.meta?.totalErrors} Error(s) Detected`
                  : "System Running Normally"}
              </p>
              <p className={`text-sm ${
                data.meta?.totalErrors > 0 ? "text-red-700" : "text-green-700"
              }`}>
                {data.meta?.totalErrors > 0
                  ? "Please review the system logs"
                  : "All systems operational"}
              </p>
            </div>
          </div>

          {/* Memory Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-sky-900" />
              Memory Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200">
                <p className="text-sm text-gray-600 mb-2">Heap Usage</p>
                <p className="text-3xl font-bold text-sky-900">
                  {getMemoryUsagePercentage(data.memory.heapUsed, data.memory.heapTotal)}%
                </p>
                <div className="w-full bg-sky-300 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-sky-900"
                    style={{
                      width: `${getMemoryUsagePercentage(
                        data.memory.heapUsed,
                        data.memory.heapTotal
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200">
                <p className="text-sm text-gray-600 mb-2">RSS Memory</p>
                <p className="text-2xl font-bold text-sky-900">
                  {formatBytes(data.memory.rss)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-1">Total Heap</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatBytes(data.memory.heapTotal)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-1">Used</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatBytes(data.memory.heapUsed)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-1">External</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatBytes(data.memory.external)}
                </p>
              </div>
            </div>
          </div>

          {/* CPU Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-sky-900" />
              CPU Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200">
                <p className="text-sm text-gray-600 mb-2">User CPU Time</p>
                <p className="text-3xl font-bold text-sky-900">
                  {data.cpu.user}
                </p>
                <p className="text-xs text-gray-600 mt-2">milliseconds</p>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200">
                <p className="text-sm text-gray-600 mb-2">System CPU Time</p>
                <p className="text-3xl font-bold text-sky-900">
                  {data.cpu.system}
                </p>
                <p className="text-xs text-gray-600 mt-2">milliseconds</p>
              </div>
            </div>
          </div>

          {/* System Info Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.uptime}
                </p>
              </div>
              <div className={`p-4 rounded-lg border ${
                data.meta?.totalErrors > 0
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}>
                <p className="text-xs text-gray-600 font-semibold mb-2">Total Errors</p>
                <p className={`text-2xl font-bold ${
                  data.meta?.totalErrors > 0 ? "text-red-900" : "text-green-900"
                }`}>
                  {data.meta?.totalErrors}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 font-semibold mb-2">Last Updated</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(data.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Report Generated:</span>
              <span className="font-semibold text-gray-900">
                {new Date(data.meta?.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Snapshot Time:</span>
              <span className="font-semibold text-gray-900">
                {new Date(data.timestamp).toLocaleString()}
              </span>
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

export default SystemPerformanceModal;
