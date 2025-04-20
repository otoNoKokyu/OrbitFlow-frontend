import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useNavigate, useLocation, NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ListTodo,
  Layers,
  Inbox,
  Calendar,
  Users
} from "lucide-react"
import { FC, useMemo, useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/store"

type Props = {
  collapsed: boolean;
  handleCollapse: (val: boolean) => void;
}

const Sidebar: FC<Props> = ({ collapsed, handleCollapse }) => {
  const navigate = useNavigate()
  const {user} = useAppSelector((state)=>state.auth)
  const { pathname } = useLocation()
  const [searchQuery, setSearchQuery] = useState("")

  const iconClass = `h-${collapsed ? 6 : 4} w-${collapsed ? 6 : 4}`

  const sidebarItems = useMemo(() => [
    { label: "Dashboard", icon: <LayoutDashboard className={iconClass} />, path: "/dashboard" },
    { label: "Tasks", icon: <ListTodo className={iconClass} />, path: "/tasks" },
    { label: "Dock", icon: <Layers className={iconClass} />, path: "/dock" },
    { label: "Inbox", icon: <Inbox className={iconClass} />, path: "/inbox" },
    { label: "Calendar", icon: <Calendar className={iconClass} />, path: "/calendar" },
    { label: "Meeting", icon: <Users className={iconClass} />, path: "/meeting" }
  ], [collapsed])

  useEffect(() => {
    console.log(32)
    if (pathname === "/" || pathname === "") navigate("/dashboard",{state: sidebarItems[0].label})
  }, [pathname, navigate])

  return (
    <aside className={`fixed top-0 left-0 transition-all duration-500 ${collapsed ? 'w-20' : 'w-64'} bg-[#f8f8f8] h-screen p-4 flex flex-col`}>
      
      {/* Top Logo / Avatar */}
      <div className="flex justify-between items-center mb-4">
        {!collapsed && <img src="/icon.jpg" alt="icon" style={{ width: 55, height: 55 }} />}
        <div className="rounded-full h-[55px] w-[55px] flex justify-center items-center bg-[#f1eaea] text-sm shrink-0">
          {user?.username?.[0].toUpperCase()}
        </div>
      </div>
      
      {/* Collapse Button */}
      <div className="flex justify-end mb-4">
        <Button variant="ghost" size="icon" onClick={() => handleCollapse(!collapsed)}>
          <FontAwesomeIcon icon={collapsed ? faArrowRight : faArrowLeft} />
        </Button>
      </div>
      
      {/* Search Bar */}
      {!collapsed && (
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
      )}
      
      {/* Navigation Items */}
      <nav className="space-y-6 px-1">
        {sidebarItems.map((item, index) => (
          <NavLink
            key={index}
            state={item.label}
            to={item.path}
            className={({ isActive }) => `
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
              ${isActive || (index === 0 && (pathname === "/" || pathname === "")) ? "bg-gray-200 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50"}
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <span className="text-gray-500 flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar