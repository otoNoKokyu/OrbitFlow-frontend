import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  User,
  Briefcase
} from "lucide-react"

type SidebarItem = {
  label: string
  icon: React.ReactNode
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
  { label: "Your Work", icon: <Briefcase className="h-4 w-4" /> },
  { label: "Teams", icon: <User className="h-4 w-4" /> },
  { label: "Settings", icon: <Settings className="h-4 w-4" /> }
]

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-muted border-r py-3 px-4">
      <h2 className="text-lg font-semibold mb-6">JIRA Clone</h2>
      <nav className="space-y-1">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2"
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
