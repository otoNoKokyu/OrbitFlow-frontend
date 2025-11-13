import OtpBox from '../../common/component/OtpBox';
import Login from './components/Login';
import Signup from './components/Signup'
import { useRoutes } from 'react-router-dom';
import authService from './service/auth.service';
import AuthProvider from '@/common/contexts/AuthContext';
import ForgotPasswordCard from './components/ForgotPassword';

export default function AuthRoutes() {
    const routes = useRoutes([
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/register',
            element: <Signup />
        },
        {
            path: '/forgot-password',
            element: <ForgotPasswordCard />
        },
        {
            path: '/verify',
            element: <OtpBox
                submitFn={authService.verifyOtp}
                resendFn={authService.sendOtp}
                optionalFn={authService.callRegister}
            />
        },
    ]);
    return <AuthProvider>{routes}</AuthProvider>;
}

