import React, { useEffect, useRef, useState } from "react";

interface TimerProps {
  expiresIn: number; 
  onExpire: () => void; 
}

const Timer: React.FC<TimerProps> = ({ expiresIn, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<number|null>(null);

  useEffect(() => {
    const savedExpiry = localStorage.getItem("otpExpiryTime");
    const expiryTime = savedExpiry ? parseInt(savedExpiry, 10) : Date.now() + expiresIn * 1000;

    if (!savedExpiry) {
      localStorage.setItem("otpExpiryTime", expiryTime.toString());
    }

    const updateRemainingTime = () => {
      const remainingTime = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimeLeft(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(timerRef.current!);
        localStorage.removeItem("otpExpiryTime"); 
        onExpire?.();
      }
    };

    updateRemainingTime(); 
    timerRef.current = setInterval(updateRemainingTime, 1000);

    return () => {
      clearInterval(timerRef.current!);
    };
  }, [expiresIn, onExpire]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return <p>OTP expires in: {formatTime(timeLeft)}</p>;
};

export default Timer;
