import React from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ErrorHandler from '../../../common/component/ErrorHandler';

const EmailInviteForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

  const onSubmit = (data: { email: string }) => {
    alert(`Email submitted: ${data.email}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <input
        type="email"
        placeholder="Provide Email"
        {...register('email', { 
          required: 'Email is required', 
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } 
        })}
        style={{ marginRight: '10px' }}
      />
      {errors.email && <ErrorHandler text={errors.email.message}/>}
      <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </button>
    </form>
  );
};

export default EmailInviteForm;
