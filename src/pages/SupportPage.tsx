/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import UserReportCard from "../components/UserReportCard";
import UserFeedbackCard from "../components/UserFeedbackCard";
import UserFeedbackModal from "../components/UserFeedbackModal";
import { useGetAllReportsQuery } from "../redux/features/reports/reportsApi";
import { useGetAllFeedbackQuery, useUpdateStatusOfFeedbackMutation } from "../redux/features/feedbacks/feedbackApi";
import Loader from "../components/Loader";
import { toast } from "sonner";

type Category = "issues" | "feedback" | "system";

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

interface FeedbackData {
  _id: string;
  comment: string;
  rating: number;
  userID: UserData;
  createdAt: string;
  updatedAt: string;
}

const SupportPage: React.FC = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("issues");
  const { data, isLoading } = useGetAllReportsQuery(undefined);
  const { data: feedbacks, isLoading: isFeedbackLoading } =
    useGetAllFeedbackQuery(undefined);
const [updateStatusOfFeedback,{isLoading: isUpdatingFeedback}] = useUpdateStatusOfFeedbackMutation()



  if (isLoading || isFeedbackLoading || isUpdatingFeedback) {
    return (
      <Loader />
    );
  }
const handleMarkFeedbackCompleted = async (feedbackId: string) => {
  try {
    const res = await updateStatusOfFeedback(feedbackId)
    if(res.error){
      toast.error("Failed to update feedback status")
    }
    if(res.data.status === "success"){
      handleCloseReportModal()
      toast.success("Feedback marked as Completed")
    }
  } catch (error) {
    console.log(error)
  }
}
  const handleViewReport = (report: ReportData) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
  };

  const handleViewFeedback = (feedback: FeedbackData) => {
    setSelectedFeedback(feedback);
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedFeedback(null);
  };

  const getStatusColor = (status?: string | null) => {
    const colors: Record<string, string> = {
      Completed: "bg-green-100 text-green-700",
      "In Progress": "bg-orange-100 text-orange-700",
      Progress: "bg-orange-100 text-orange-700",
    };
    return status
      ? colors[status] || "bg-gray-100 text-gray-700"
      : "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-sky-900 mb-8 border-b border-gray-200 p-8">
        Support
      </h1>

      <div className="p-8 space-y-8">
        {/* Category Tabs (same pattern as Reports) */}
        <div className="flex gap-3">
          {[
            { key: "issues", label: "User Issues" },
            { key: "feedback", label: "Feedback Analysis" },
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCategory === "issues" && data?.data?.length > 0 ? (
            data.data?.map((report: any, index: number) => (
              <UserReportCard
                key={index}
                report={report}
                onView={() => handleViewReport(report)}
              />
            ))
          ) : activeCategory === "feedback" && feedbacks?.data?.length > 0 ? (
            feedbacks.data?.map((feedback: any, index: number) => (
              <UserFeedbackCard
                key={index}
                feedback={feedback}
                onView={() => handleViewFeedback(feedback)}
              />
            ))
          ) : activeCategory === "system" ? (
            <div className="col-span-full bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
              System support items coming soon.
            </div>
          ) : (
            <div className="col-span-full bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
              No items available in this category.
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header with User Info */}
            <div className="sticky top-0 bg-gradient-to-r from-sky-900 to-sky-700 p-6 border-b border-sky-800">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  <img
                    src={selectedReport.userID.imgUrl || "https://picsum.photos/40/40?seed=admin"}
                    alt={`${selectedReport.userID.firstName} ${selectedReport.userID.lastName}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">
                      {selectedReport.problemtitle}
                    </h2>
                    <div className="mt-2 space-y-1">
                      <p className="text-sky-100">
                        Reported by{" "}
                        <span className="font-semibold">
                          {selectedReport.userID.firstName}{" "}
                          {selectedReport.userID.lastName}
                        </span>
                      </p>
                      <p className="text-sky-100 text-sm">
                        {selectedReport.userID.email}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseReportModal}
                  className="text-sky-100 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    selectedReport.status
                  )}`}
                >
                  {selectedReport.status}
                </span>
              </div>

              {/* Problem Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Problem Description
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {selectedReport.desdetails}
                </p>
              </div>

              {/* Dates Section */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Created</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {new Date(selectedReport.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Updated</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {new Date(selectedReport.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

              {/* User Details Section */}
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Reporter Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span className="font-medium">
                      {selectedReport.userID.firstName}{" "}
                      {selectedReport.userID.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">
                      {selectedReport.userID.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">User ID:</span>
                    <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                      {selectedReport.userID._id.slice(0, 12)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* IDs Reference */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Reference IDs
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <p className="text-gray-600">
                    Report ID:{" "}
                    <span className="text-gray-900">{selectedReport._id}</span>
                  </p>
                  <p className="text-gray-600">
                    User ID:{" "}
                    <span className="text-gray-900">
                      {selectedReport.userID._id}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50">
              <button
                onClick={handleCloseReportModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
              >
                Close
              </button>
              <button onClick={()=>handleMarkFeedbackCompleted(selectedReport._id)} className="px-6 py-2 bg-sky-900 hover:bg-sky-800 text-white rounded-lg font-semibold transition">
                Take Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <UserFeedbackModal
        feedback={selectedFeedback}
        isOpen={showFeedbackModal}
        onClose={handleCloseFeedbackModal}
      />
    </div>
  );
};

export default SupportPage;
