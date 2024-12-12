import React, { useEffect, useState } from "react";

interface TimerProps {
  expiresIn: number;
  onExpire: () => void;
}

const Timer: React.FC<TimerProps> = ({ expiresIn, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const storedExpiry = localStorage.getItem("otpExpiry");
    const storedExpiryUnix = storedExpiry ? parseInt(storedExpiry, 10) : 0;

    if (expiresIn > storedExpiryUnix) {
      localStorage.setItem("otpExpiry", expiresIn.toString());
      return expiresIn - Math.floor(new Date().getTime() / 1000);
    }
    return storedExpiryUnix - Math.floor(new Date().getTime() / 1000);
  });

  useEffect(() => {
    const storedExpiry = localStorage.getItem("otpExpiry");
    const storedExpiryUnix = storedExpiry ? parseInt(storedExpiry, 10) : 0;

    if (expiresIn > storedExpiryUnix) {
      localStorage.setItem("otpExpiry", expiresIn.toString());
      setTimeLeft(expiresIn - Math.floor(new Date().getTime() / 1000));
    }

    const interval = setInterval(() => {
      const currentTime = Math.floor(new Date().getTime() / 1000);
      const expiryTime = Math.max(expiresIn, storedExpiryUnix);
      const newTimeLeft = expiryTime - currentTime;

      if (newTimeLeft <= 0) {
        onExpire();
        localStorage.removeItem("otpExpiry");
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

  return <p>OTP expires in: {timeLeft > 0 ? formatTime(timeLeft) : "Expired"}</p>;
};

export default Timer;
