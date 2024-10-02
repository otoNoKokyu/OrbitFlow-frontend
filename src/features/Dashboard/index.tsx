import React, { useEffect } from 'react'
import { useAuth } from '../../common/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const {user} = useAuth()
    const navigate = useNavigate()
    useEffect(()=>{
        if(!user) navigate('/login')
    },[])
  return (
    <h1 style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
        Welcome to the Orbitflow Dashbaord
    </h1>
  )
}

export default Dashboard
