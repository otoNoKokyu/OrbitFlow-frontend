import React, { useCallback, useEffect } from 'react'
import '../../../css/pages/signup.css'
import MultiStepForm from '../../../common/component/MultistepForm'
import SignupBasic from '../Forms/Signup_Basic'
import SignupAddress from '../Forms/Signup_Address'
import authService from '../service/auth.service'
import { useAuth } from '../../../common/hooks/useAuth'
import { StepperComponent } from '../../../common/types/Auth/auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { SignupType } from '../Model/auth.model'

const Signup: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get('id');
  const signUpHandler = useCallback(
    async (data: SignupType) => {
      let tempRegisterData: SignupType | unknown = { ...data };
      if (paramValue) tempRegisterData = { ...data, inviteId: paramValue };
      localStorage.setItem("tempRegisterData", JSON.stringify(tempRegisterData));
      const { expiresIn } = await authService.sendOtp({ email: data.email })
      const encodedData = btoa(JSON.stringify({ email: data.email, expiresIn }));
      navigate({
        pathname: "/verify",
        search: `?cred=${encodedData}`,
      });
    },
    []
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
