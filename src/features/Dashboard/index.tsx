import React, { useEffect } from 'react';
import { useAuth } from '../../common/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authService from '../Authentication/service/auth.service';

const Dashboard = () => {
  const { user, tokens, setUserMeta } = useAuth();
  const navigate = useNavigate();
  console.log(user)
  console.log(tokens)
  useEffect(() => {
    if (!user) {
      navigate('/register');
    } else if (!tokens) {
      navigate('/login');
    }
  }, []);

  return (
    <h1 style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      Welcome to the Orbitflow Dashboard
    </h1>
  );
};

export default Dashboard;
