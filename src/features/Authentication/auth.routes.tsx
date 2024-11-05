// authRoutes.ts
import Login from './Components/Login';
import Signup from './Components/Signup'
import { useRoutes } from 'react-router-dom';

export default function AuthRoutes() {
    const routes  = useRoutes([
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <Signup />
        },
    ]);
    return routes

}

