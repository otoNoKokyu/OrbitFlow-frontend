import React, { useState } from 'react';
import '../../css/common/common.css';
import Timer from './Timer';
interface OtpBoxProps {
  submitFn: (otp: number) => void;
  resendfFn: () => void;
  reciver: string;
}

const OtpBox: React.FC<OtpBoxProps> = ({ submitFn,resendfFn, reciver }) => {

  const [otp, setOtp] = useState<number>(0);
  const [resend, setResend] = useState(false)

  const handleSubmit = () => {
    submitFn(otp);
  };

  const onExpire = ()=> {
    setResend(true)
    resendfFn()

  } 

  return (
    <div className="wrapper">
    <div className="otp-container">
      <h1 className="otp-title">Verify Your Account</h1>
      <p className="otp-instruction">We are sending a OTP to validate your email. Hang on!</p>
      <div className="otp-inputs">
        <input type="text" maxLength={1}  />
        <input type="text" maxLength={1}  />
        <input type="text" maxLength={1}  />
        <input type="text" maxLength={1}  />
      </div>
      <p className="otp-sent-info">A Otp has been sent to <strong>{reciver}</strong></p>
      {
        resend?
        <button className='resend-btn'>Resend</button>:
         <Timer expiresIn={10} onExpire={onExpire}/>
        }
      <button className="otp-button">Submit</button>
    </div>
  </div>

  );
};

export default OtpBox;
