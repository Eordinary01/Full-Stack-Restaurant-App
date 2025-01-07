'use client';
import React from 'react';
import { Transition } from '@headlessui/react';
import { AlertCircle, X } from 'lucide-react';

const ErrorDisplay = ({
  message,
  onClose,
  variant = 'default',
  position = 'inline',
  duration = 5000,
  // New prop to control whether error should display above modals
  aboveModal = true
}) => {
  if (!message) return null;

  const positionClasses = {
    'top-right': 'fixed top-4 right-4 w-96',
    'top-left': 'fixed top-4 left-4 w-96',
    'bottom-right': 'fixed bottom-4 right-4 w-96',
    'bottom-left': 'fixed bottom-4 left-4 w-96',
    'inline': 'w-full'
  };

  const variantClasses = {
    default: 'bg-red-900 border-l-4 border-red-500',
    toast: 'bg-red-500 text-gray-100',
    subtle: 'bg-red-50 border border-red-200'
  };

  React.useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <Transition
      show={Boolean(message)}
      enter="transition-all duration-300"
      enterFrom="opacity-0 translate-y-[-1rem]"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={`
        ${positionClasses[position]}
        ${variantClasses[variant]}
        ${aboveModal ? 'z-[9999]' : 'z-10'}
        rounded-lg shadow-lg
      `}
    >
      <div 
        className="flex items-center justify-between p-4 gap-3"
        // Stop event propagation to prevent interfering with modal
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 flex-1">
          <AlertCircle 
            className={`
              w-5 h-5 flex-shrink-0
              ${variant === 'toast' ? 'text-white' : 'text-red-500'}
            `}
          />
          <span 
            className={`
              text-sm font-medium
              ${variant === 'toast' ? 'text-white' : 'text-red-700'}
            `}
          >
            {message}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`
            p-1 rounded-full flex-shrink-0
            ${variant === 'toast' 
              ? 'text-white hover:bg-red-400' 
              : 'text-red-500 hover:bg-red-100'
            }
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
          `}
          aria-label="Close error message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </Transition>
  );
};

export default ErrorDisplay;
