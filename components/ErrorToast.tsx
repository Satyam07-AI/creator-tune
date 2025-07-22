
import React, { useEffect } from 'react';
import { XIcon } from './icons';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const ErrorToast = ({ message, onClose, duration = 5000 }: ErrorToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, duration]);

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-center w-full max-w-sm p-4 text-gray-100 bg-red-800/90 backdrop-blur-sm rounded-lg shadow-lg"
      role="alert"
    >
      <div className="ml-3 text-sm font-medium">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-red-500/20 text-gray-100 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-red-500/40 inline-flex items-center justify-center h-8 w-8"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ErrorToast;
