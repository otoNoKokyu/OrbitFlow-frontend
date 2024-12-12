import { useEffect, useState } from "react";
import authService from "../Authentication/service/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/hooks/useAuth";

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
    // Show loading spinner or message
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        Welcome to the Orbitflow Dashboard
      </h1>
      <div>
        <button onClick={async () => await authService.getMe()}>
          Fetch ME
        </button>
      </div>
    </>
  );
};

