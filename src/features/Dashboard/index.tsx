import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/hooks/useAuth";
import '../../css/pages/dashboard.css'


export const Dashboard = () => {
  const { user, tokens } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokens || !user) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [user, tokens, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="project-container roboto-medium">
        <div className="project-container-header">
          
        </div>
      </div>
    </>
  );
};

