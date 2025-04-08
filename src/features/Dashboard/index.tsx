import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/hooks/useAuth";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import '../../css/pages/dashboard.css'


export const Dashboard = () => {
  const { user, tokens } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens || !user) {
      navigate('/login');
    }
  }, [user, tokens, navigate]);

  if (!user || !tokens) return null
  return (
    <>
      <TopBar
        username={user?.username?.[0].toUpperCase()!!}
        userId={user.user_id}
        // projects={user.projects}
      />
      <Sidebar />
      {/* <div className="project-container roboto-medium">
        <div className="project-container-header">

        </div>
      </div> */}
    </>
  );
};

