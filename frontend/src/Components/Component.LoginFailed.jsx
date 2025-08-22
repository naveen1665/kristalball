import React, { useEffect, useState } from 'react';

function LoginFailed({ duration = 3000, onClose ,text=""}) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <>
      {isVisible && (
        <div
          className="
            fixed top-4 left-3/4 transform -translate-x-1/2
            pointer-events-none
            animate-toast-in
            bg-white text-red-700
            px-6 py-3 rounded-lg
            shadow-lg
             min-w-[300px] max-w-sm
            flex items-center space-x-2
            font-medium text-sm tracking-wide
            border-l-4 border-red-500
            z-50
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-red-600 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4.732c-.77-1.333-2.694-1.333-3.464 0L3.34 16.732c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{text}</span>
        </div>
      )}
    </>
  );
}

export default LoginFailed;