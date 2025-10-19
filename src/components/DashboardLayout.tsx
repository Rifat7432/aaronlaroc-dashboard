import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"


export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto border-l-2 border-t-2 border-gray-200 rounded-tl-[36px] bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
