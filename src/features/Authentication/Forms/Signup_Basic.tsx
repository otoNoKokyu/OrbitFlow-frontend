import React, { forwardRef } from 'react';
import '../../../css/pages/signup.css';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import ErrorHandler from '../../../common/component/ErrorHandler';
import { DefaultValues } from '../../../common/interface/Auth/auth';

const SignupBasic = forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => { 
    const { register, formState: { errors,defaultValues } } = useFormContext<Pick<DefaultValues,'signupbasics'>>();

    return (
        <div className={classNames('signup-common', className)} ref={ref}>
            <div className="name">
                <input
                    {...register('signupbasics.first_name', { required: 'Firstname is required' })}
                    type="text"
                    placeholder="Firstname"
                />

                <input
                    {...register('signupbasics.last_name', { required: 'Lastname is required' })}
                    type="text"
                    placeholder="Lastname"
                />
            </div>
            <ErrorHandler text={errors.signupbasics?.first_name?.message || errors.signupbasics?.last_name?.message} />

            <div>
                <input
                    {...register('signupbasics.email', { required: 'Email is required' })}
                    type="email"
                    placeholder="Email"
                />
                <ErrorHandler text={errors.signupbasics?.email?.message} />
            </div>

            <div>
                <input
                    {...register('signupbasics.phone_number', { required: 'Phone number is required' })}
                    type="number"
                    placeholder="Phone No"
                />
                <ErrorHandler text={errors.signupbasics?.phone_number?.message} />
            </div>

            <div>
                <input
                    {...register('signupbasics.date_of_birth', { required: 'Date of Birth is required' })}
                    type="date"
                    placeholder="Date of Birth"
                />
                <ErrorHandler text={errors.signupbasics?.date_of_birth?.message} />
            </div>

            <div>
                <input
                    {...register('signupbasics.username', { required: 'Username is required' })}
                    type="text"
                    placeholder="Username"
                />
                <ErrorHandler text={errors.signupbasics?.username?.message} />
            </div>
        </div>
    );
});

export default SignupBasic;
