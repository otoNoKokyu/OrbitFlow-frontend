import { Button } from "@/components/ui/button"
import { Bell, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Make sure this file exists!
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAppDispatch } from "@/store"
import { logout } from "@/store/auth/authSlice"
import { InviteEmail } from "./InviteEmail"
import projectService from "../service/project.service"
import { Project } from "../Model/project.model"
import Modal from "@/common/component/Modal"
import authService from "@/features/Authentication/service/auth.service"
import { RoleEnum } from "@/common/types/Auth/auth"

const Topbar2 = ({ userId }: { userId: string }) => {
  const { state } = useLocation()
  const [showInvite, setShowInvite] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()


  return (
    <>
      <header
        className={`top-0 right-0 h-16 bg-white p-10 border-b border-gray-100 flex items-center justify-between px-6`}
      >
        <h1 className="text-3xl font-[400]">{state}</h1>
        <div className="flex items-center space-x-5">
          <Button variant="outline" onClick={() => setShowInvite(true)} size='lg' className="p-4 bg-gray-100 hover:bg-gray-200 ">
            + Invite Members
          </Button>
          <Bell className="w-5 h-7 text-gray-500" />
          <LogOut className="w-5 h-7 text-gray-500" onClick={() => {
            dispatch(logout())
            navigate('/login')
          }} />
        </div>
        {
          showInvite && (
            <Modal
             closeModal={() => setShowInvite(false)}>
              <InviteEmail  
                closeInviteModal={()=>setShowInvite(false)}
                userId={userId}
              />
            </Modal>
          )
        }
      </header>
    </>


  )
}

export default Topbar2
