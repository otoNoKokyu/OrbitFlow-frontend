import { useForm } from 'react-hook-form';
import '../../../css/pages/login.css'
import { LoginType } from '../../../common/interface/Auth/auth';
import ErrorHandler from '../../../common/component/ErrorHandler';
import { useAuth } from '../../../common/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { validateEmail, validatePassword } from '../constants/auth.constant';


const Login = () => {
    const {login,user} = useAuth()
    const navigate = useNavigate()

    useEffect(()=>{
        if(user) navigate('/')
    },[])

    const { register, handleSubmit, formState: { errors } } = useForm<LoginType>();

    const onSubmit = (form: LoginType) => {
        login(form)
        navigate('/')   
    }

    return (
        <div className='login-container'>
            <div className='login-heading'>
                <h1>Welcome back</h1>

            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input
                        {...register('email', { required: 'Email is required', validate: validateEmail })}
                        type="text"
                        placeholder='Enter your email' />
                </div>
                {errors.email && <ErrorHandler text={'provide correct email'} />}
                <div>
                    <input
                        {...register('password', { required: 'Password is required', validate: validatePassword })}
                        type="text" placeholder='Enter your password' />
                </div>
                {errors.password && <ErrorHandler text={'provide correct password'} />}
                <div className='submit'>
                    <button type='submit'>
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}



export default Login
