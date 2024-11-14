import { useForm } from 'react-hook-form';
import '../../../css/pages/login.css'
import { LoginType } from '../../../common/types/Auth/auth';
import ErrorHandler from '../../../common/component/ErrorHandler';
import { useAuth } from '../../../common/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { validateEmail } from '../constants/auth.constant';


const Login = () => {
    const {login,user,tokens} = useAuth()
    const navigate = useNavigate()

    useEffect(()=>{
        if(user && tokens) navigate('/')
    },[])

    const { register, handleSubmit, formState: { errors } } = useForm<LoginType>();

    const onSubmit = async(form: LoginType) => {
        await login(form)
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
                        {...register('password', { required: 'Password is required' })}
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
