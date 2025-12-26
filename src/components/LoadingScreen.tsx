import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export const LoadingScreen = ({ onComplete, duration = 1500 }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 300); // Wait for fade-out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-white to-gray-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex flex-col items-center space-y-6">
        {/* TII Logo with rotating semicircle */}
        <div className="relative w-32 h-32">
          {/* Rotating semicircle */}
          <div className="absolute inset-0 animate-spin-slow drop-shadow-[0_0_8px_rgba(124,58,237,0.4)]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M 50 10 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="hsl(var(--tii-purple))"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          {/* Static TII text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-tii-purple drop-shadow-sm">TII</span>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-gray-800 animate-pulse drop-shadow-[0_2px_8px_rgba(124,58,237,0.3)]">
            Loading your Invoice Portal…
          </p>
          <p className="text-sm text-gray-600">
            Technology Innovation Institute — Secure Cloud Portal
          </p>
        </div>
      </div>
    </div>
  );
};
