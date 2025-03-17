import React, { useEffect } from "react";
import logo from "../assets/logo.png";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // Match animation duration to CSS (1.4s)
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1400);

    return () => {
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-975">
      <div className="splash-logo-animation">
        <img src={logo} alt="App Logo" className="w-40 h-40 object-contain" />
      </div>
    </div>
  );
};

export default SplashScreen;
