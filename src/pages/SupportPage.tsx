import React, { useState } from "react";
import { X } from "lucide-react";
import TaskCard from "../components/TaskCard";

interface Task {
  icon: React.ReactNode;
  title: string;
  description: string;
  date: string;
  status?: "Completed" | "In Progress" | string | null;
  details?: string;
  priority?: string;
  assignedTo?: string;
  category?: string;
}

const SupportPage: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks: Task[] = [
    {
      icon: "⚡",
      title: "System Performance",
      description: "Server uptime and performance metrics report",
      date: "September 2024",
      status: "Completed",
      details:
        "Detailed analysis of server performance metrics including uptime statistics, response times, and resource utilization. The report shows 99.9% uptime with excellent performance across all services.",
      priority: "High",
      assignedTo: "DevOps Team",
      category: "Infrastructure",
    },
    {
      icon: "⭐",
      title: "Customer Feedback",
      description: "Survey results and customer satisfaction ratings",
      date: "August 2024",
      status: "Completed",
      details:
        "Comprehensive analysis of customer feedback from recent surveys. Overall satisfaction rating of 4.5/5 with positive feedback on product quality and customer service. Areas for improvement identified in delivery times.",
      priority: "Medium",
      assignedTo: "Customer Success",
      category: "Feedback Analysis",
    },
    {
      icon: "🔒",
      title: "Security Audit",
      description:
        "Comprehensive security analysis and vulnerability assessment",
      date: "In Progress",
      status: "In Progress",
      details:
        "Ongoing security audit covering all system components. Currently reviewing authentication mechanisms, data encryption protocols, and access control systems. Expected completion in 2 weeks.",
      priority: "Critical",
      assignedTo: "Security Team",
      category: "Security & Compliance",
    },
    {
      icon: "📊",
      title: "Marketing Campaign",
      description: "ROI and engagement metrics for recent campaigns",
      date: "October 2024",
      status: "Completed",
      details:
        "Marketing campaign analysis showing a 25% increase in engagement and 15% ROI improvement. Social media reach expanded by 40% with strong performance across all platforms.",
      priority: "Medium",
      assignedTo: "Marketing Team",
      category: "Marketing Analytics",
    },
    {
      icon: "📈",
      title: "Monthly User Report",
      description: "Comprehensive analysis of user activity for the past month",
      date: "October 2024",
      status: "Completed",
      details:
        "Detailed breakdown of user activity showing 20% month-over-month growth. Active users increased to 50,000 with average session duration of 15 minutes. User retention rate improved to 85%.",
      priority: "High",
      assignedTo: "Analytics Team",
      category: "User Analytics",
    },
  ];

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const getPriorityColor = (priority?: string) => {
    const colors: Record<string, string> = {
      Critical: "bg-red-100 text-red-700",
      High: "bg-orange-100 text-orange-700",
      Medium: "bg-yellow-100 text-yellow-700",
      Low: "bg-blue-100 text-blue-700",
    };
    return priority
      ? colors[priority] || "bg-gray-100 text-gray-700"
      : "bg-gray-100 text-gray-700";
  };

  const getStatusColor = (status?: string | null) => {
    const colors: Record<string, string> = {
      Completed: "bg-green-100 text-green-700",
      "In Progress": "bg-orange-100 text-orange-700",
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
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-tl-lg rounded-tr-2xl rounded-br-2xl rounded-bl-2xl p-6 hover:shadow-lg transition cursor-pointer flex items-center">
            <p className="text-lg font-bold text-sky-900">User Issues</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-tl-lg rounded-tr-2xl rounded-br-2xl rounded-bl-2xl p-6 hover:shadow-lg transition cursor-pointer flex items-center">
            <p className="text-lg font-bold text-sky-900">User Issues</p>
          </div>
          {tasks.map((task, index) => (
            <TaskCard
              key={index}
              icon={task.icon}
              title={task.title}
              description={task.description}
              date={task.date}
              status={task.status ?? undefined}
              onView={() => handleViewTask(task)}
            />
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="text-4xl">{selectedTask.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedTask.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedTask.description}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status and Priority Badges */}
              <div className="flex flex-wrap gap-3">
                {selectedTask.status && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      Status
                    </span>
                    <span
                      className={`text-sm font-semibold px-4 py-2 rounded-full ${getStatusColor(
                        selectedTask.status
                      )}`}
                    >
                      {selectedTask.status}
                    </span>
                  </div>
                )}
                {selectedTask.priority && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      Priority
                    </span>
                    <span
                      className={`text-sm font-semibold px-4 py-2 rounded-full ${getPriorityColor(
                        selectedTask.priority
                      )}`}
                    >
                      {selectedTask.priority}
                    </span>
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Details
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedTask.details}
                </p>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
                  <p className="text-gray-900 font-medium">
                    {selectedTask.date}
                  </p>
                </div>
                {selectedTask.assignedTo && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Assigned To
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedTask.assignedTo}
                    </p>
                  </div>
                )}
                {selectedTask.category && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Category
                    </p>
                    <p className="text-gray-900 font-medium">
                      {selectedTask.category}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-sky-900 text-white rounded-lg font-medium hover:bg-sky-800 transition duration-200">
                Take Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
