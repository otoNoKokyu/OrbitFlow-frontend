import React, {useState} from 'react';
import '../../css/common/common.css';
import Timer from './Timer';
import ErrorHandler from './ErrorHandler';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import useApiManager from '../hooks/useApiManager';

interface OtpBoxProps {
  submitFn: (data: { otp: number; email: string }) => Promise<any>;
  resendFn: (data: { email: string }) => Promise<any>;
}

const OtpBox: React.FC<OtpBoxProps> = ({ submitFn,resendFn,}) => {

  const [searchParams] = useSearchParams()
  const credentials = JSON.parse(atob(searchParams.get('cred')!!))  
  const {email,expiresIn} = credentials
  if(!email || !expiresIn) return null

  const [otp, setOtp] = useState<string[]>(["", "", "", "",""]);
  const [resend, setResend] = useState(false);
  // const [otpResponse, setotpResponse] = useState<string>('')
  const navigate = useNavigate()

  const [otpExpiry, setOtpExpiry] = useState(expiresIn)
  const handleInputChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) { 
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
    }
  };

  const handleSubmit = async() => {
    const completeOtp = otp.join("");
     await submitFn({
      email:email,
      otp: +completeOtp,
    });
     navigate('/login')
  };

  const onExpire = () => setResend(true);

  return (
    <div className="wrapper">
      <div className="otp-container">
        <h1 className="otp-title">Verify Your Account</h1>
        <p className="otp-instruction">We are sending a OTP to validate your email. Hang on!</p>
        <div className="otp-inputs">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !value && index > 0) {
                  (e.target as HTMLInputElement).previousElementSibling?.focus();
                }
              }}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                if (input.value.length === 1 && index < otp.length - 1) {
                  input.nextElementSibling?.focus();
                }
              }}
            />
          ))}
        </div>
        <p className="otp-sent-info">
          A Otp has been sent to <strong>{email}</strong>
        </p>
        {resend ? (
          <button onClick={async()=>{
            const resendData = await resendFn({ email})
            if (resendData && (resendData as any).expiresIn) {
            setOtpExpiry((resendData as any).expiresIn);
            setResend(false)

            }
          }} className="resend-btn">Resend</button>
        ) : (
          <Timer expiresIn={otpExpiry} onExpire={onExpire} />
        )}
        <button className="otp-button" onClick={handleSubmit}>
          Submit
        </button>
        {/* {otpResponse && <ErrorHandler text={otpResponse}/>} */}
      </div>
    </div>
  );
};

export default OtpBox;
