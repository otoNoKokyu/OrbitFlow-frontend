import React, { useCallback, useEffect, useState } from 'react'
import '../../../css/pages/signup.css'
import MultiStepForm from '../../../common/component/MultistepForm'
import SignupBasic from '../Forms/Signup_Basic'
import SignupAddress from '../Forms/Signup_Address'
import authService from '../service/auth.service'
import { useAuth } from '../../../common/hooks/useAuth'
import { StepperComponent } from '../../../common/types/Auth/auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { SignupType } from '../Model/auth.model'
import HomeBar from '@/components/ui/SIdeHome'

const Signup: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get('id');
  const [invitedEmail,setInvitedEmail] = useState<string|null>(null);
  const signUpHandler = useCallback(
    async (data: SignupType) => {
      console.log(invitedEmail)
      let tempRegisterData: SignupType | unknown = { ...data };
      if (paramValue) tempRegisterData = { ...data, inviteId: paramValue };
      localStorage.setItem("tempRegisterData", JSON.stringify(tempRegisterData));
      const { expiresIn } = await authService.sendOtp({ email: data.email??invitedEmail })
      const encodedData = btoa(JSON.stringify({ email: data.email??invitedEmail, expiresIn }));
      navigate({
        pathname: "/verify",
        search: `?cred=${encodedData}`,
      });
    },
    [invitedEmail]
  );
  useEffect(() => {
    if(paramValue){
      authService.getInvitedEmail(paramValue).then(res=>setInvitedEmail(res.email)).catch(err=>console.error(err))
    }
    logout()
  }, [])
  const children: StepperComponent = [
    {
      component: (ref, className) => <SignupBasic emailDisabled={invitedEmail!} className={className} ref={ref} />
    },
    {
      component: (ref, className) => <SignupAddress className={className} ref={ref} />
    },
  ]
  return (
    <div className="flex">
      <div className="w-1/2">
        <HomeBar />
      </div>
      <div className='signup-container min-w-[350px] text-left mt-[200px] mx-auto'>
        <MultiStepForm
          title='Join OrbitFlow!'
          children={children}
          saveFn={signUpHandler}
        />
      </div>
    </div>

  )
}

export default Signup
