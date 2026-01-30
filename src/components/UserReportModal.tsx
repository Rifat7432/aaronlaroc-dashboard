import React from "react";
import { X, Download } from "lucide-react";
import { toast } from "sonner";
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

interface UserReportModalProps {
  data: UserReportData | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string): { badge: string; text: string } => {
  switch (status?.toLowerCase()) {
    case "progress":
    case "in progress":
      return { badge: "bg-blue-100 text-blue-800", text: "text-blue-900" };
    case "completed":
      return { badge: "bg-green-100 text-green-800", text: "text-green-900" };
    case "pending":
      return { badge: "bg-yellow-100 text-yellow-800", text: "text-yellow-900" };
    case "on hold":
      return { badge: "bg-red-100 text-red-800", text: "text-red-900" };
    default:
      return { badge: "bg-gray-100 text-gray-800", text: "text-gray-900" };
  }
};

const UserReportModal: React.FC<UserReportModalProps> = ({ data, isOpen, onClose }) => {
  if (!isOpen || !data) return null;

  const statusColor = getStatusColor(data.status);

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;

      // Header with user info
      doc.setFontSize(16);
      doc.setFont("Helvetica", "bold");
      doc.text("User Support Report", 20, yPosition);
      yPosition += 8;

      // Generated date
      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
      yPosition += 6;

      // Divider
      doc.setDrawColor(200);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;

      // User Information Section
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("User Information", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const userInfo = [
        ["Name", `${data.userID.firstName} ${data.userID.lastName}`],
        ["Email", data.userID.email],
        ["User ID", data.userID._id],
      ];

      userInfo.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, yPosition);
        doc.text(value, 90, yPosition, { maxWidth: 100 });
        yPosition += 6;
      });

      yPosition += 4;

      // Report Details Section
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Report Details", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");

      // Problem Title
      doc.setFont("Helvetica", "bold");
      doc.text("Problem Title:", 20, yPosition);
      yPosition += 5;
      doc.setFont("Helvetica", "normal");
      const titleLines = doc.splitTextToSize(data.problemtitle, 170);
      doc.text(titleLines, 20, yPosition);
      yPosition += titleLines.length * 5 + 3;

      // Problem Description
      doc.setFont("Helvetica", "bold");
      doc.text("Description:", 20, yPosition);
      yPosition += 5;
      doc.setFont("Helvetica", "normal");
      const descLines = doc.splitTextToSize(data.desdetails, 170);
      doc.text(descLines, 20, yPosition);
      yPosition += descLines.length * 5 + 3;

      // Status
      doc.setFont("Helvetica", "bold");
      doc.text("Status:", 20, yPosition);
      doc.setFont("Helvetica", "normal");
      doc.text(data.status, 90, yPosition);
      yPosition += 8;

      // Timeline Section
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Timeline", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      const timelineData = [
        ["Created", formatDate(data.createdAt)],
        ["Last Updated", formatDate(data.updatedAt)],
      ];

      timelineData.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, yPosition);
        doc.text(value, 90, yPosition);
        yPosition += 6;
      });

      // Report IDs Section
      yPosition += 4;
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Reference IDs", 20, yPosition);
      yPosition += 6;

      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");
      const idsData = [
        ["Report ID", data._id],
        ["User ID", data.userID._id],
      ];

      idsData.forEach(([label, value]) => {
        doc.setFont("Helvetica", "bold");
        doc.text(`${label}:`, 20, yPosition);
        doc.setFont("Helvetica", "normal");
        const idLines = doc.splitTextToSize(value, 120);
        doc.text(idLines, 90, yPosition);
        yPosition += Math.max(5, idLines.length * 4) + 2;
      });

      // Footer
      yPosition = 270;
      doc.setFontSize(8);
      doc.setFont("Helvetica", "italic");
      doc.setTextColor(128);
      doc.text("Aaron Laroc Dashboard • User Support Management System", 20, yPosition);
      doc.text(`Report Generated on ${new Date().toLocaleString()}`, 20, 280);

      // Save the PDF
      doc.save(`user-report-${data._id.slice(0, 8)}-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-900 to-sky-800 p-6 border-b border-sky-900">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {data.problemtitle}
              </h2>
              <p className="text-sky-100 text-sm mt-1">Support Report Details</p>
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
        <div className="p-6 space-y-6">
          {/* User Information Card */}
          <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-4 rounded-lg border border-sky-200">
            <h3 className="text-lg font-bold text-sky-900 mb-4">User Information</h3>
            <div className="flex items-center gap-4 mb-4">
              {data.userID.imgUrl ? (
                <img
                  src={data.userID.imgUrl  || "https://picsum.photos/40/40?seed=admin"}
                  alt={`${data.userID.firstName} ${data.userID.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-sky-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-sky-900 flex items-center justify-center text-white text-xl font-bold">
                  {data.userID.firstName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {data.userID.firstName} {data.userID.lastName}
                </p>
                <p className="text-sm text-gray-600">{data.userID.email}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">{data.userID._id}</p>
              </div>
            </div>
          </div>

          {/* Problem Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Problem Description
              </label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{data.desdetails}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusColor.badge}`}
                >
                  {data.status}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 font-semibold mb-2">CREATED</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(data.createdAt)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 font-semibold mb-2">LAST UPDATED</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(data.updatedAt)}</p>
            </div>
          </div>

          {/* Reference IDs */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
            <p className="text-xs text-gray-600 font-semibold">REFERENCE IDs</p>
            <div className="space-y-1">
              <p className="text-xs font-mono text-gray-700 break-all">
                <span className="font-bold text-gray-900">Report:</span> {data._id}
              </p>
              <p className="text-xs font-mono text-gray-700 break-all">
                <span className="font-bold text-gray-900">User:</span> {data.userID._id}
              </p>
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

export default UserReportModal;
