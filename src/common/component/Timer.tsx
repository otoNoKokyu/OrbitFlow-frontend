import React, { useEffect, useState } from "react";

interface TimerProps {
  expiresIn: number;
  onExpire: () => void;
}

const Timer: React.FC<TimerProps> = ({ expiresIn, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(expiresIn - Math.floor(new Date().getTime() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const newTimeLeft = expiresIn - currentTime;
      
      if (newTimeLeft <= 0) {
        onExpire();
        clearInterval(interval);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresIn, onExpire]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return <p>OTP expires in: {formatTime(timeLeft)}</p>;
};

export default Timer;
