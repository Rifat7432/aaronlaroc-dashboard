import React from "react";
import { X, Star } from "lucide-react";

interface UserData {
  _id: string;
  email: string;
  imgUrl: string;
  firstName: string;
  lastName: string;
}

interface FeedbackData {
  _id: string;
  comment: string;
  rating: number;
  userID: UserData;
  createdAt: string;
  updatedAt: string;
}

interface UserFeedbackModalProps {
  feedback: FeedbackData | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserFeedbackModal: React.FC<UserFeedbackModalProps> = ({
  feedback,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !feedback) return null;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  const getRatingLabel = (rating: number) => {
    const labels: Record<number, string> = {
      5: "Excellent",
      4: "Good",
      3: "Average",
      2: "Poor",
      1: "Very Poor",
    };
    return labels[rating] || "Unrated";
  };

  return (
    <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with User Info */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 border-b border-emerald-700">
          <div className="flex justify-between items-start">
            <div className="flex gap-4 flex-1">
              <img
                src={feedback.userID.imgUrl  || "https://picsum.photos/40/40?seed=admin"} 
                alt={`${feedback.userID.firstName} ${feedback.userID.lastName}`}
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Customer Feedback
                </h2>
                <div className="space-y-1">
                  <p className="text-emerald-50">
                    From{" "}
                    <span className="font-semibold">
                      {feedback.userID.firstName} {feedback.userID.lastName}
                    </span>
                  </p>
                  <p className="text-emerald-100 text-sm">
                    {feedback.userID.email}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-emerald-100 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Rating Section */}
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={`${
                    i < feedback.rating
                      ? getRatingColor(feedback.rating)
                      : "text-gray-300"
                  } fill-current`}
                />
              ))}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {feedback.rating} / 5
              </p>
              <p
                className={`text-sm font-semibold ${getRatingColor(
                  feedback.rating
                )}`}
              >
                {getRatingLabel(feedback.rating)}
              </p>
            </div>
          </div>

          {/* Comment Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Feedback Comment</h3>
            <p className="text-gray-700 leading-relaxed bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              {feedback.comment}
            </p>
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 font-medium">Submitted</p>
              <p className="font-medium text-gray-900 mt-1">
                {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Last Updated</p>
              <p className="font-medium text-gray-900 mt-1">
                {new Date(feedback.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Reviewer Information Section */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Reviewer Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span className="font-medium">
                  {feedback.userID.firstName} {feedback.userID.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{feedback.userID.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                  {feedback.userID._id.slice(0, 12)}...
                </span>
              </div>
            </div>
          </div>

          {/* IDs Reference */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Reference IDs</h4>
            <div className="space-y-2 text-xs font-mono">
              <p className="text-gray-600">
                Feedback ID:{" "}
                <span className="text-gray-900">{feedback._id}</span>
              </p>
              <p className="text-gray-600">
                User ID:{" "}
                <span className="text-gray-900">{feedback.userID._id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Close
          </button>
        
        </div>
      </div>
    </div>
  );
};

export default UserFeedbackModal;
