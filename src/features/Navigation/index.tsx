import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import '../../css/pages/dashboard.css'
import { useAppSelector } from "@/store";
import authService from "../Authentication/service/auth.service";


export const Navigation = () => {
  const {user,tokens} = useAppSelector((state)=>state.auth)
  const navigate = useNavigate();
  useEffect(() => {
    if (authService.checkForEmptyUserState([user,tokens]))  {
      navigate('/login')
    };
  }, []);
  if (authService.checkForEmptyUserState([user,tokens])) return null
  return (
    <>
      {/* <TopBar
        username={user?.username?.[0].toUpperCase()!!}
        userId={user.user_id}
        // projects={user.projects}
      /> */}
      <Sidebar />
      {/* <div className="project-container roboto-medium">
        <div className="project-container-header">

        </div>
      </div> */}
    </>
  );
};

