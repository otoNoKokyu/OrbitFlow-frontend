import React, { useEffect, useState } from 'react';
import '../../css/common/common.css';
import Timer from './Timer';
import ErrorHandler from './ErrorHandler';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

interface OtpBoxProps {
  submitFn: (data: { otp?: number; type: 'resend' | 'verify'; email: string }) => Promise<boolean>;

}

const OtpBox: React.FC<OtpBoxProps> = ({ submitFn,}) => {
  const [searchParams] = useSearchParams()
  const credentials = JSON.parse(atob(searchParams.get('cred')!!))  
  const {email,expiresIn} = credentials
  if(!email || !expiresIn) return null
  const [otp, setOtp] = useState<string[]>(["", "", "", "",""]);
  const [resend, setResend] = useState(false);
  const [otpMatched, setotpMatched] = useState<boolean|null>(null)
  const navigate = useNavigate()

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
    const isValid = await submitFn({
      email:email,
      otp: +completeOtp,
      type: 'verify'    
    });
    if(isValid) setotpMatched(false)
    else navigate('/login')
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
          <button onClick={()=>{
            submitFn({type:'resend', email:email})
            setResend(false)
          }} className="resend-btn">Resend</button>
        ) : (
          <Timer expiresIn={expiresIn} onExpire={onExpire} />
        )}
        <button className="otp-button" onClick={handleSubmit}>
          Submit
        </button>
        {otpMatched === false && <ErrorHandler text='otp mismatched'/>}
      </div>
    </div>
  );
};

export default OtpBox;
