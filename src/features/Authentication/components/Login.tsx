import { Controller, useForm } from 'react-hook-form';
import '../../../css/pages/login.css'
import { LoginType } from "../Model/auth.model";
import ErrorHandler from '../../../common/component/ErrorHandler';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { validateEmail } from '../../../utility/validator';
import { login } from '@/store/auth/authThunk';
import { useAppDispatch, useAppSelector } from '@/store';
import authService from '../service/auth.service';
import HomeBar from '@/components/ui/SIdeHome';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
const Login = () => {
    const { user, tokens } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        if (!authService.checkForEmptyUserState([user, tokens])) {
            navigate('/')
        }
    }, []);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginType>();
    const onSubmit = async (form: LoginType) => {
        try {
            const loginResults = await dispatch(login(form)).unwrap();
            if (loginResults) {
                navigate('/');
            }
        } catch (err) {
            console.error("Login failed:", err);
            // toast / error handling here
        }
    }
    return (
        <div className='flex'>
            <div className="w-1/2">
                <HomeBar />
            </div>
            <div className='login-container min-w-[350px] text-left flex flex-col justify-center mx-auto'>
                <div className='login-heading'>
                    <h1 className='poppins-regular text-left text-4xl'>Welcome back!</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                validate: (value) => validateEmail(value) || "Invalid email",
                            }}
                            render={({ field }) => (
                                <Input className='py-5 mt-1' {...field} type="text" />
                            )}
                        />
                        {errors.email && <ErrorHandler text="Provide correct email" />}
                    </div>

                    <div>
                        <Label className='mb-5' htmlFor="email">Passowrd</Label>
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: "Password is required" }}
                            render={({ field }) => (
                                <Input className='py-5 mt-1' {...field} type="password" />
                            )}
                        />
                        {errors.password && <ErrorHandler text="Provide correct password" />}
                    </div>

                    <div className="submit">
                        <Button type="submit" className="w-full bg-slate-900 py-5 font-semibold text-xl">Login</Button>
                    </div>
                </form>
                <div className="signup-redirect">
                    <p>Don't have an account?</p>
                    <Link to='/register'>Click here</Link>
                </div>
            </div>

        </div>
    )
}
export default Login
