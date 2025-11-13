import { forwardRef, useEffect } from 'react';
import '../../../css/pages/signup.css';
import classNames from 'classnames';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorHandler from '../../../common/component/ErrorHandler';
import { RegisterUser } from '../../../common/types/Auth/auth';

const SignupBasic = forwardRef<HTMLDivElement, { className?: string, emailDisabled: string }>(({ className, emailDisabled }, ref) => {
  const { control, formState: { errors },setValue } = useFormContext<RegisterUser>();
  const email = useWatch({ control, name: 'email' });
  const phone = useWatch({ control, name: 'phone_number' });

  useEffect(()=>{
    if(emailDisabled) setValue('email',emailDisabled,{ shouldValidate: true })
  },[emailDisabled])

  

  const X =     <div className={classNames('signup-common', className)} ref={ref}>
      <div className="name grid grid-cols-2 gap-4">
        <div className='!m-0'>
          <Label>First Name</Label>
          <Controller
            name="first_name"
            control={control}
            rules={{ required: 'Firstname is required' }}
            render={({ field }) => <Input  {...field} type="text" />}
          />
          <ErrorHandler text={errors.first_name?.message} />
        </div>

        <div className='!m-0'>
          <Label>Last Name</Label>
          <Controller
            name="last_name"
            control={control}
            rules={{ required: 'Lastname is required' }}
            render={({ field }) => <Input {...field} type="text" />}
          />
          <ErrorHandler text={errors.last_name?.message} />
        </div>
      </div>

      { <div className="mt-4">
        <Label>Email</Label>
        <Controller
          name="email"
          disabled={!!emailDisabled}
          control={control}
          rules={{
            validate: () =>
              email || phone ? true : 'Either email or phone number is required',
          }}
          render={({ field }) => <Input {...field}  type="email" />}
        />
        <ErrorHandler text={errors.email?.message} />
      </div>}

      <div className="mt-4">
        <Label>Phone Number</Label>
        <Controller
          name="phone_number"
          control={control}
          rules={{
            validate: () =>
              email || phone ? true : 'Either phone number or email is required',
          }}
          render={({ field }) => <Input {...field} type="number" />}
        />
        <ErrorHandler text={errors.phone_number?.message} />
      </div>

      <div className="mt-4">
        <Label>Password</Label>
        <Controller
          name="password_hash"
          control={control}
          rules={{ required: 'Password is required' }}
          render={({ field }) => <Input {...field} type="password" />}
        />
        <ErrorHandler text={errors.password_hash?.message} />
      </div>

      <div className="mt-4">
        <Label>Date of Birth</Label>
        <Controller
          name="date_of_birth"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="date"
              value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ''}
            />
          )}
        />
        <ErrorHandler text={errors.date_of_birth?.message} />
      </div>
    </div>
  return (X);
});

export default SignupBasic;
