import { ChevronRight } from "lucide-react"
import React from "react"

interface TaskCardProps {
  icon: React.ReactNode
  title: string
  description: string
  date: string
  status?: "Completed" | "In Progress" | string
  onView?: () => void
}

const TaskCard= ({
  icon,
  title,
  description,
  date,
  status,
  onView,
}:TaskCardProps) => {
  const statusColors: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    "In Progress": "bg-orange-100 text-orange-700",
  }
console.log(title,icon,description,date,status)
  return (
    <div className="bg-white border border-gray-200 rounded-tl-lg rounded-tr-2xl rounded-br-2xl rounded-bl-2xl p-6 hover:shadow-lg transition cursor-pointer" onClick={onView}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {status && (
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              statusColors[status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{date}</p>
        <button
          className="text-sky-900 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
        >
          View <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default TaskCard