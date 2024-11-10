import React from 'react'
import '../../../css/pages/signup.css'
import MultipartForm from '../../../common/component/MultipartForm'
import SignupBasic from '../Forms/Signup_Basic'
import SignupAddress from '../Forms/Signup_Address'
import { IUser } from '../../../common/interface/Auth/auth'

const Signup:  React.FC  = () => {

  const defaultValues = {
    signupbasics: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        username: '',
    },
    signupaddress: {
        address: '',
        city: '',
        state: '',
        zip_code: '',
    },
};

type Child<T> = {
  component: (ref: React.RefObject<T>, className?: string) => JSX.Element;
};
  
    const children: Array<Child<HTMLDivElement| HTMLInputElement>> =  [
      {
        component: (ref,className)=> <SignupBasic className={className} ref={ref}/>
      },
      {
        component: (ref,className)=> <SignupAddress className={className} ref={ref} />
      },
    ]

  
  return (
    <div className='signup-container'>
      <MultipartForm
      title='Orbitflow'
      children={children}
      defaultValues={defaultValues}
      />
    </div>
  )
}

export default Signup
