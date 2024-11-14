import React, { useEffect } from 'react';
import { useAuth } from '../../common/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authService from '../Authentication/service/auth.service';

const Dashboard = () => {
  const { user, tokens } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!tokens && !user) {
      navigate('/login');
    } else if (!tokens) {
      navigate('/login');
    }else if(!user){
      navigate('/register')
    }
  }, []);
  if(!user && !tokens) return null
  return (
    <h1 style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      Welcome to the Orbitflow Dashboard
    </h1>
  );
};

export default Dashboard;
