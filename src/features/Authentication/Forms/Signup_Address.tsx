import React, { forwardRef } from 'react'
import '../../../css/pages/signup.css'
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { DefaultValues, IUser } from '../../../common/interface/Auth/auth';
import ErrorHandler from '../../../common/component/ErrorHandler';

const SignupAddress = forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => { 
    
    const { register, formState: { errors } } = useFormContext<Pick<DefaultValues,'signupaddress'>>();

    return (
        <div className={classNames('signup-common', className)} ref={ref}>
            <div>
                <input
                    {...register('signupaddress.address')}
                    type="text" placeholder='Address' />
            </div>
            <div>
                <input 
                    {...register('signupaddress.city')}
                    type="text" placeholder='city' />
            </div>
            <div>
                <input 
                    {...register('signupaddress.state', { required: 'state is required' })}
                    type="text" placeholder='State' />
            </div>
            <ErrorHandler text={errors.signupaddress?.state?.message}/>
            <div>
                <input 
                    {...register('signupaddress.zip_code')}
                    type="text" placeholder='zip code' />
            </div>
        </div>
    );
});

export default SignupAddress;
