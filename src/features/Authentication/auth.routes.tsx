// authRoutes.ts
import OtpBox from '../../common/component/OtpBox';
import Login from './components/Login';
import Signup from './components/Signup'
import { useRoutes } from 'react-router-dom';
import authService from './service/auth.service';

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
        {
            path: '/verify',
            element: <OtpBox 
            submitFn={authService.verifyOtp}
            resendFn={authService.sendOtp}
             />
        },
    ]);
    return routes

}

