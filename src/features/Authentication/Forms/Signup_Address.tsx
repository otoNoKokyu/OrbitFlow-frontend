import React, { forwardRef } from 'react'
import '../../../css/pages/signup.css'
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { User } from '../../../common/types/Auth/auth';
import ErrorHandler from '../../../common/component/ErrorHandler';

const SignupAddress = forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {

    const { register, formState: { errors } } = useFormContext<User>();

    return (
        <div className={classNames('signup-common', className)} ref={ref}>
            <div>
                <input
                    {...register('address')}
                    type="text" placeholder='Address' />
            </div>
            <div>
                <input
                    {...register('city')}
                    type="text" placeholder='city' />
            </div>
            <div>
                <input
                    {...register('state', { required: 'state is required' })}
                    type="text" placeholder='State' />
            </div>
            <ErrorHandler text={errors.state?.message} />
            <div>
                <input
                    {...register('zip_code')}
                    type="text" placeholder='zip code' />
            </div>
            <div>
                <input
                    {...register('username', { required: 'Username is required' })}
                    type="text"
                    placeholder="Username"
                />
                <ErrorHandler text={errors.username?.message} />
            </div>

        </div>
    );
});

export default SignupAddress;
