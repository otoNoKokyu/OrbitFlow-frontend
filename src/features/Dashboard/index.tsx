import React, { useEffect, useState } from 'react';
import { useAuth } from '../../common/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, tokens } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log(user,tokens)

  useEffect(() => {
    setLoading(false);
    
    if (!tokens ||!user) {
      navigate('/login');
    }
  }, [user, tokens, navigate]);

  if (loading) return null;

  return (
    <h1 style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      Welcome to the Orbitflow Dashboard
    </h1>
  );
};

export default Dashboard;
