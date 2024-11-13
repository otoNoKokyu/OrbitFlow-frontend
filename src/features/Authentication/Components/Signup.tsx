import React, { useEffect } from 'react'
import '../../../css/pages/signup.css'
import MultipartForm from '../../../common/component/MultipartForm'
import SignupBasic from '../Forms/Signup_Basic'
import SignupAddress from '../Forms/Signup_Address'
import { IUser } from '../../../common/interface/Auth/auth'
import authService from '../service/auth.service'
import { useAuth } from '../../../common/hooks/useAuth'

type Child<T> = {
  component: (ref: React.RefObject<T>, className?: string) => JSX.Element;
};
const Signup:  React.FC  = () => {

  const {logout} = useAuth()

  useEffect(()=>{
    logout()
  },[])

  
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
      saveFn = {authService.callRegister}
      />
    </div>
  )
}

export default Signup
