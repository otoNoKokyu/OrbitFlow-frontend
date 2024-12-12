import '../../../css/common/common.css';
import { useFormContext } from 'react-hook-form';
import { User } from '../../../common/types/Auth/auth';
import ErrorHandler from '../../../common/component/ErrorHandler';

const OtpBox = () => {
    const { register, formState: { errors } } = useFormContext<Pick<User, 'otp'>>();

    return (
        <><div className='otp-box'>
            <input {...register('otp',{required:'otp is required'})} type="number" 

                placeholder='Please enter your otp' />
                <ErrorHandler text={errors.otp?.message} />
        </div></>
    )
}
export default OtpBox