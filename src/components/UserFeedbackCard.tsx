import React from "react";
import { Calendar, Star } from "lucide-react";

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

interface UserFeedbackCardProps {
  feedback: FeedbackData;
  onView?: (feedback: FeedbackData) => void;
}

const UserFeedbackCard: React.FC<UserFeedbackCardProps> = ({
  feedback,
  onView,
}) => {
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* User Info Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-4">
        <div className="flex items-center gap-3">
          <img
            src={feedback.userID.imgUrl || "https://picsum.photos/40/40?seed=admin"}
            alt={`${feedback.userID.firstName} ${feedback.userID.lastName}`}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
          <div className="flex-1">
            <h3 className="text-white font-semibold">
              {feedback.userID.firstName} {feedback.userID.lastName}
            </h3>
            <p className="text-emerald-50 text-sm">{feedback.userID.email}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Rating Display */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={`${
                  i < feedback.rating ? getRatingColor(feedback.rating) : "text-gray-300"
                } fill-current`}
              />
            ))}
          </div>
          <span
            className={`text-sm font-semibold ${getRatingColor(
              feedback.rating
            )}`}
          >
            {getRatingLabel(feedback.rating)}
          </span>
        </div>

        {/* Comment */}
        <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
          {feedback.comment}
        </p>

        {/* Date Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-100">
          <Calendar size={14} />
          <span>{formatDate(feedback.createdAt)}</span>
        </div>

        {/* IDs (for reference) */}
        <div className="space-y-1 text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
          <p>Feedback ID: {feedback._id.slice(0, 8)}...</p>
          <p>User ID: {feedback.userID._id.slice(0, 8)}...</p>
        </div>
      </div>

      {/* Action Button */}
      {onView && (
        <div className="px-4 pb-4">
          <button
            onClick={() => onView(feedback)}
            className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default UserFeedbackCard;
