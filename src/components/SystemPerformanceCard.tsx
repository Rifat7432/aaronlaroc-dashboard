import React from "react";
import { Download, Cpu, Zap, Clock } from "lucide-react";
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

interface SystemPerformanceCardProps {
  data: SystemPerformanceData;
  onViewDetails?: (data: SystemPerformanceData) => void;
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

const getStatusColor = (percentage: number): string => {
  if (percentage >= 80) return "text-red-600";
  if (percentage >= 60) return "text-orange-600";
  return "text-green-600";
};

const SystemPerformanceCard: React.FC<SystemPerformanceCardProps> = ({
  data,
  onViewDetails,
}) => {
  const memoryUsagePercent = getMemoryUsagePercentage(
    data.memory.heapUsed,
    data.memory.heapTotal
  );

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Title
      doc.setFontSize(16);
      doc.setFont("Helvetica", "bold");
      doc.text("System Performance Report", 20, yPosition);
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

      // Memory Section
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
        ["Heap Usage", `${memoryUsagePercent}%`],
        ["External Memory", formatBytes(data.memory.external)],
      ];

      memoryData.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, yPosition);
        doc.text(value, 110, yPosition, { align: "right" });
        yPosition += 6;
      });

      yPosition += 4;

      // CPU Section
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("CPU Statistics", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const cpuData = [
        ["User CPU Time", `${data.cpu.user}ms`],
        ["System CPU Time", `${data.cpu.system}ms`],
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
      ];

      systemData.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, yPosition);
        doc.text(value, 110, yPosition, { align: "right" });
        yPosition += 6;
      });

      // Footer
      doc.setFontSize(8);
      doc.setFont("Helvetica", "italic");
      doc.text("Aaron Laroc Dashboard • System Performance Monitor", 20, 280);

      // Save the PDF
      doc.save(`system-performance-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-900 to-sky-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">System Performance</h3>
              <p className="text-sky-100 text-sm">Real-time metrics</p>
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="bg-white hover:bg-sky-50 text-sky-900 p-2 rounded-lg transition"
            title="Download PDF"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Memory Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-sky-900" />
            <h4 className="font-semibold text-gray-900">Memory Usage</h4>
          </div>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Heap Used</span>
              <span className={`text-sm font-semibold ${getStatusColor(memoryUsagePercent)}`}>
                {memoryUsagePercent}%
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  memoryUsagePercent >= 80
                    ? "bg-red-600"
                    : memoryUsagePercent >= 60
                    ? "bg-orange-600"
                    : "bg-green-600"
                }`}
                style={{ width: `${memoryUsagePercent}%` }}
              />
            </div>
            <div className="text-md text-gray-500 space-y-1">
              <p>Total: {formatBytes(data.memory.heapTotal)}</p>
              <p>Used: {formatBytes(data.memory.heapUsed)}</p>
              <p>RSS: {formatBytes(data.memory.rss)}</p>
            </div>
          </div>
        </div>

        {/* CPU Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-sky-900" />
            <h4 className="font-semibold text-gray-900">CPU Time</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg text-sm">
            <div>
              <p className="text-gray-600">User</p>
              <p className="font-semibold text-gray-900">{data.cpu.user}ms</p>
            </div>
            <div>
              <p className="text-gray-600">System</p>
              <p className="font-semibold text-gray-900">{data.cpu.system}ms</p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-green-600" />
            <h4 className="font-semibold text-gray-900">System Info</h4>
          </div>
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between text-md">
              <span className="text-gray-600">Uptime</span>
              <span className="font-semibold text-gray-900">{data.uptime}</span>
            </div>
            <div className="flex justify-between text-md">
              <span className="text-gray-600 ">Errors</span>
              <span className={`font-semibold ${data.meta?.totalErrors > 0 ? "text-red-600" : "text-green-600"}`}>
                {data.meta?.totalErrors}
              </span>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-md text-gray-500 pt-2 border-t border-gray-200">
          <p>Updated: {new Date(data.timestamp).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Action Button */}
      {onViewDetails && (
        <div className="px-5 pb-5">
          <button
            onClick={() => onViewDetails(data)}
            className="w-64 px-3 py-2 bg-sky-900 hover:bg-sky-800 text-white rounded-lg font-semibold text-sm transition"
          >
            View Full Report
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemPerformanceCard;
