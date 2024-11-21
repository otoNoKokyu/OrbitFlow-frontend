import React, { useCallback, useEffect } from 'react'
import '../../../css/pages/signup.css'
import MultiStepForm from '../../../common/component/MultistepForm'
import SignupBasic from '../Forms/Signup_Basic'
import SignupAddress from '../Forms/Signup_Address'
import authService from '../service/auth.service'
import { useAuth } from '../../../common/hooks/useAuth'
import { StepperComponent } from '../../../common/types/Auth/auth'
import { useNavigate } from 'react-router-dom'

const Signup: React.FC = () => {
  const { logout, setUserMeta } = useAuth()
  const navigate = useNavigate()
  const signUpHandler = useCallback(
    async (data: any) => {
      const response = await authService.callRegister(data);
      setUserMeta(response);
      const encodedData = btoa(JSON.stringify(response));
      navigate({
        pathname: "/verify",
        search: `?cred=${encodedData}`,
      });
    },
    [setUserMeta]
  );

  useEffect(() => {
    logout()
  }, [])

  const children: StepperComponent = [
    {
      component: (ref, className) => <SignupBasic className={className} ref={ref} />
    },
    {
      component: (ref, className) => <SignupAddress className={className} ref={ref} />
    },

  ]


  return (
    <div className='signup-container'>
      <MultiStepForm
        title='Orbitflow'
        children={children}
        saveFn={signUpHandler}
      />
    </div>
  )
}

export default Signup
