import React, { useState } from "react";
import { X } from "lucide-react";
import TaskCard from "../components/TaskCard";

type Category = "issues" | "feedback" | "system";

interface Task {
  icon: React.ReactNode;
  title: string;
  description: string;
  date: string;
  status?: "Completed" | "In Progress" | string | null;
  details?: string;
  priority?: string;
  assignedTo?: string;
  category?: Category;
}

const SupportPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("issues");

  const tasks: Task[] = [
    {
      icon: "⭐",
      title: "Customer Feedback",
      description: "Survey results and customer satisfaction ratings",
      date: "August 2024",
      status: "Completed",
      details:
        "Comprehensive analysis of customer feedback from recent surveys. Overall satisfaction rating of 4.5/5 with positive feedback on product quality and customer service.",
      priority: "Medium",
      assignedTo: "Customer Success",
      category: "feedback",
    },
  ];

  const filteredTasks = tasks.filter(
    (task) => task.category === activeCategory
  );

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

      <div className="p-8 space-y-8">
        {/* Category Tabs (same pattern as Reports) */}
        <div className="flex gap-3">
          {[
            { key: "issues", label: "User Issues" },
            { key: "feedback", label: "Feedback Analysis" },
            { key: "system", label: "System Support" },
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

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <TaskCard
                key={index}
                icon={task.icon}
                title={task.title}
                description={task.description}
                date={task.date}
                status={task.status ?? undefined}
                onView={() => handleViewTask(task)}
              />
            ))
          ) : (
            <div className="col-span-full bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
              No support items available in this category.
            </div>
          )}
        </div>
      </div>

      {/* Details Modal (UNCHANGED – already perfect) */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black/65 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between">
              <div className="flex gap-4">
                <div className="text-4xl">{selectedTask.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedTask.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedTask.description}
                  </p>
                </div>
              </div>
              <button onClick={handleCloseModal}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="flex gap-4">
                {selectedTask.status && (
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      selectedTask.status
                    )}`}
                  >
                    {selectedTask.status}
                  </span>
                )}
                {selectedTask.priority && (
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getPriorityColor(
                      selectedTask.priority
                    )}`}
                  >
                    {selectedTask.priority}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <p className="text-gray-700">{selectedTask.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedTask.date}</p>
                </div>
                {selectedTask.assignedTo && (
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="font-medium">
                      {selectedTask.assignedTo}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 border rounded-lg"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-sky-900 text-white rounded-lg">
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
