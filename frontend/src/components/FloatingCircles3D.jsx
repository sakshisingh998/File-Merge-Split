// src/components/FloatingCircles3D.jsx
import React from "react";
import theme from "../config/theme";

function FloatingCircles3D() {
  return (
    <>
      <style jsx>{`
        @keyframes float1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) rotateZ(0deg);
          }
          25% {
            transform: translate3d(30px, -20px, 50px) scale(1.1) rotateZ(90deg);
          }
          50% {
            transform: translate3d(-20px, 30px, -30px) scale(0.9) rotateZ(180deg);
          }
          75% {
            transform: translate3d(25px, -15px, 20px) scale(1.05) rotateZ(270deg);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) rotateX(0deg);
          }
          33% {
            transform: translate3d(-25px, 25px, 40px) scale(1.2) rotateX(120deg);
          }
          66% {
            transform: translate3d(20px, -15px, -25px) scale(0.8) rotateX(240deg);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) rotateY(0deg);
          }
          33% {
            transform: translate3d(20px, -40px, 35px) scale(0.9) rotateY(120deg);
          }
          66% {
            transform: translate3d(-30px, 10px, -20px) scale(1.1) rotateY(240deg);
          }
        }

        @keyframes float4 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) rotateZ(0deg) rotateY(0deg);
          }
          25% {
            transform: translate3d(-15px, -25px, 30px) scale(1.3) rotateZ(90deg) rotateY(90deg);
          }
          50% {
            transform: translate3d(25px, 15px, -15px) scale(0.7) rotateZ(180deg) rotateY(180deg);
          }
          75% {
            transform: translate3d(-10px, 20px, 25px) scale(1.1) rotateZ(270deg) rotateY(270deg);
          }
        }

        @keyframes float5 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) rotateX(0deg) rotateZ(0deg);
          }
          20% {
            transform: translate3d(35px, -10px, 40px) scale(1.15) rotateX(72deg) rotateZ(72deg);
          }
          40% {
            transform: translate3d(-15px, 35px, -30px) scale(0.85) rotateX(144deg) rotateZ(144deg);
          }
          60% {
            transform: translate3d(25px, -25px, 20px) scale(1.25) rotateX(216deg) rotateZ(216deg);
          }
          80% {
            transform: translate3d(-30px, 15px, -10px) scale(0.95) rotateX(288deg) rotateZ(288deg);
          }
        }

        @keyframes float6 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1) rotateY(0deg) rotateX(0deg);
          }
          30% {
            transform: translate3d(-20px, 30px, 45px) scale(1.05) rotateY(108deg) rotateX(108deg);
          }
          60% {
            transform: translate3d(30px, -20px, -35px) scale(0.9) rotateY(216deg) rotateX(216deg);
          }
        }

        .floating-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(1px);
          opacity: 0.6;
          transition: all 0.3s ease;
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .floating-circle:hover {
          opacity: 0.8;
          filter: blur(0px);
          transform: scale(1.1) !important;
        }

        .circle-1 {
          width: 120px;
          height: 120px;
          top: 10%;
          left: 15%;
          background: radial-gradient(circle at 30% 30%, rgba(54, 34, 34, 0.4), rgba(54, 34, 34, 0.1));
          animation: float1 20s ease-in-out infinite;
          box-shadow: 0 0 30px rgba(54, 34, 34, 0.3);
        }

        .circle-2 {
          width: 80px;
          height: 80px;
          top: 25%;
          right: 20%;
          background: radial-gradient(circle at 30% 30%, rgba(169, 144, 126, 0.5), rgba(169, 144, 126, 0.1));
          animation: float2 15s ease-in-out infinite;
          animation-delay: -2s;
          box-shadow: 0 0 25px rgba(169, 144, 126, 0.4);
        }

        .circle-3 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 25%;
          background: radial-gradient(circle at 30% 30%, rgba(103, 93, 80, 0.3), rgba(103, 93, 80, 0.1));
          animation: float3 25s ease-in-out infinite;
          animation-delay: -5s;
          box-shadow: 0 0 35px rgba(103, 93, 80, 0.3);
        }

        .circle-4 {
          width: 60px;
          height: 60px;
          bottom: 30%;
          right: 15%;
          background: radial-gradient(circle at 30% 30%, rgba(243, 222, 186, 0.6), rgba(243, 222, 186, 0.2));
          animation: float4 18s ease-in-out infinite;
          animation-delay: -3s;
          box-shadow: 0 0 20px rgba(243, 222, 186, 0.5);
        }

        .circle-5 {
          width: 100px;
          height: 100px;
          top: 50%;
          left: 8%;
          background: radial-gradient(circle at 30% 30%, rgba(54, 34, 34, 0.35), rgba(169, 144, 126, 0.15));
          animation: float5 22s ease-in-out infinite;
          animation-delay: -7s;
          box-shadow: 0 0 28px rgba(54, 34, 34, 0.3);
        }

        .circle-6 {
          width: 90px;
          height: 90px;
          top: 15%;
          right: 8%;
          background: radial-gradient(circle at 30% 30%, rgba(103, 93, 80, 0.4), rgba(243, 222, 186, 0.2));
          animation: float6 16s ease-in-out infinite;
          animation-delay: -4s;
          box-shadow: 0 0 26px rgba(103, 93, 80, 0.4);
        }

        .circle-7 {
          width: 70px;
          height: 70px;
          top: 70%;
          left: 60%;
          background: radial-gradient(circle at 30% 30%, rgba(169, 144, 126, 0.45), rgba(54, 34, 34, 0.15));
          animation: float1 19s ease-in-out infinite;
          animation-delay: -6s;
          box-shadow: 0 0 22px rgba(169, 144, 126, 0.4);
        }

        .circle-8 {
          width: 110px;
          height: 110px;
          bottom: 10%;
          right: 35%;
          background: radial-gradient(circle at 30% 30%, rgba(243, 222, 186, 0.4), rgba(103, 93, 80, 0.2));
          animation: float2 24s ease-in-out infinite;
          animation-delay: -8s;
          box-shadow: 0 0 32px rgba(243, 222, 186, 0.3);
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .circle-1 { width: 80px; height: 80px; }
          .circle-2 { width: 60px; height: 60px; }
          .circle-3 { width: 100px; height: 100px; }
          .circle-4 { width: 45px; height: 45px; }
          .circle-5 { width: 70px; height: 70px; }
          .circle-6 { width: 65px; height: 65px; }
          .circle-7 { width: 50px; height: 50px; }
          .circle-8 { width: 75px; height: 75px; }
        }

        /* Performance optimization */
        .floating-circle {
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
        <div className="floating-circle circle-5"></div>
        <div className="floating-circle circle-6"></div>
        <div className="floating-circle circle-7"></div>
        <div className="floating-circle circle-8"></div>
      </div>
    </>
  );
}

export default FloatingCircles3D;