import React, { forwardRef } from 'react';
import '../../../css/pages/signup.css';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import ErrorHandler from '../../../common/component/ErrorHandler';
import { DefaultValues, IUser } from '../../../common/interface/Auth/auth';

const SignupBasic = forwardRef<HTMLDivElement, { className?: string}>(({ className }, ref) => { 
    const { register, formState: { errors } } = useFormContext<IUser>();

    return (
            <div className={classNames('signup-common', className)} ref={ref}>
                <div className="name">
                    <input
                        {...register('first_name', { required: 'Firstname is required' })}
                        type="text"
                        placeholder="Firstname"
                    />

                    <input
                        {...register('last_name', { required: 'Lastname is required' })}
                        type="text"
                        placeholder="Lastname"
                    />
                </div>
                <ErrorHandler text={errors.first_name?.message || errors.last_name?.message} />

                <div>
                    <input
                        {...register('email', { required: 'Email is required' })}
                        type="email"
                        placeholder="Email"
                    />
                    <ErrorHandler text={errors.email?.message} />
                </div>

                <div>
                    <input
                        {...register('phone_number', { required: 'Phone number is required' })}
                        type="number"
                        placeholder="Phone No"
                    />
                    <ErrorHandler text={errors.phone_number?.message} />
                </div>

                <div>
                    <input
                        {...register('date_of_birth', { required: 'Date of Birth is required' })}
                        type="date"
                        placeholder="Date of Birth"
                    />
                    <ErrorHandler text={errors.date_of_birth?.message} />
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
        )
});

export default SignupBasic;
