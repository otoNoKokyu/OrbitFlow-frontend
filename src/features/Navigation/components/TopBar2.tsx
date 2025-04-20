import { Button } from "@/components/ui/button"
import { Bell, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Make sure this file exists!
import {useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useAppDispatch } from "@/store"
import { logout } from "@/store/auth/authSlice"

const Topbar2 = () => {
    const { state } = useLocation()  
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
  return (
    <header
      className={`top-0 right-0 h-16 bg-white border-b flex items-center justify-between px-6`}
    >
      <h1 className="text-2xl font-normal">{state}</h1>

      <div className="flex items-center space-x-5">
        <Button variant="outline" className="text-sm h-8 px-3">
          + Invite Members
        </Button>
        <Bell className="w-5 h-5 text-gray-500" />
        <LogOut className="w-5 h-5 text-gray-500" onClick={()=>{
          dispatch(logout())
          navigate('/login')
          }}/>
      </div>
    </header>
  )
}

export default Topbar2
