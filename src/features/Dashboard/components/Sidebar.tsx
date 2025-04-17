import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ListTodo,
  Layers,
  Inbox,
  Calendar,
  Users
} from "lucide-react"
import { useState } from "react"

const sidebarItems = [
  { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, path: "/" },
  { label: "Tasks", icon: <ListTodo className="h-4 w-4" />, path: "/tasks" },
  { label: "Dock", icon: <Layers className="h-4 w-4" />, path: "/dock" },
  { label: "Inbox", icon: <Inbox className="h-4 w-4" />, path: "/inbox" },
  { label: "Calendar", icon: <Calendar className="h-4 w-4" />, path: "/calendar" },
  { label: "Meeting", icon: <Users className="h-4 w-4" />, path: "/meeting" }
]

const Sidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <aside className="w-xs bg-[#f8f8f8] h-screen p-4 flex flex-col">
      <div className="flex justify-between p-4">
        <img src="public/icon.jpg" alt="icon" style={{ width: 55, height: 55 }} />
        <div className="rounded-full p-1.5 h-[55px] w-[55px] flex justify-center items-center bg-[#f1eaea]"
        >
          {'AC'}
        </div>

      </div>

      {/* Search Bar */}
      <div className="relative mb-6 px-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search"
          className="pl-9 h-9 bg-gray-100 border-none rounded-lg text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-3 top-2.5 text-gray-400 text-xs">/</div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-2 px-1">
        {sidebarItems.map((item, index) => {

          return (
            <button
              key={index}
              className={`w-full flex items-center ${activeIdx === index ? `bg-white border-b border-gray-200`: ''} gap-3 text-md px-3 py-2 rounded-lg text-left ${index === activeIdx
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              onClick={() => setActiveIdx(index)}
            >
              <span className="text-gray-500">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar