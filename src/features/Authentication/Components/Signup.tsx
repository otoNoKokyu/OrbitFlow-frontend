import React, { useEffect } from 'react'
import '../../../css/pages/signup.css'
import MultipartForm from '../../../common/component/MultistepForm'
import SignupBasic from '../Forms/Signup_Basic'
import SignupAddress from '../Forms/Signup_Address'
import authService from '../service/auth.service'
import { useAuth } from '../../../common/hooks/useAuth'
import { StepperComponent } from '../../../common/types/Auth/auth'


const Signup:  React.FC  = () => {
  const {logout,setUserMeta} = useAuth()

  useEffect(()=>{
    logout()
  },[])  

    const children: StepperComponent =  [
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
      setMetaFn = {setUserMeta}
      redirectPath='/login'
      />
    </div>
  )
}

export default Signup
