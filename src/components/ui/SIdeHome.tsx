import React from 'react';

export default function HomeBar() {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Moving background shapes */}
      <div className="absolute top-16 left-16 w-36 h-36 bg-blue-300 rounded-full opacity-25 animate-float-slow"></div>
      <div className="absolute bottom-24 right-16 w-44 h-44 bg-purple-300 rounded-full opacity-25 animate-float"></div>
      <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-pink-300 rounded-full opacity-25 animate-float-delay"></div>

      {/* Brand text */}
      <div className="text-center z-10 animate-fade-in">
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">
          OrbitFlow
        </h1>
        <p className="text-gray-700 mt-4 text-xl font-medium tracking-wide">
          Streamline Your Project Management
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-18px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float 7s ease-in-out infinite 1s;
        }

        .animate-float-slow {
          animation: float 8s ease-in-out infinite 2s;
        }

        .animate-fade-in {
          animation: fadeIn 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
