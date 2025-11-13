import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import '../../css/pages/dashboard.css'
import { useAppSelector } from "@/store";
import authService from "../Authentication/service/auth.service";
import Topbar2 from "./components/TopBar2";


export const Navigation = () => {
  const { user, tokens } = useAppSelector((state) => state.auth)
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const handleCollapse = (value: boolean) => setCollapsed(value)

  useEffect(() => {
    if (authService.checkForEmptyUserState([user, tokens])) navigate('/login')
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} handleCollapse={handleCollapse} />
      <div
    className={`flex-1 flex flex-col transition-all duration-300 ${
      collapsed ? 'pl-25' : 'pl-64' 
    }`} 
  >
    <Topbar2 userId ={user?.user_id!}/>
    <div className="flex-1 overflow-y-auto">
      <Outlet />
    </div>
  </div>
    </div>
  );
};

