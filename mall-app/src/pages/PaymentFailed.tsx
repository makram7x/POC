import React, { useEffect, useState } from "react";

interface PaymentFailedProps {
  errorMessage: string;
  onRetry: () => void;
  onChangeMethod: () => void;
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({
  errorMessage,
  onRetry,
  onChangeMethod,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component is mounted
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-5 mb-6 transition-all duration-300 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-600 animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-red-800">Payment Failed</h3>
          <div className="mt-2 text-red-700 text-sm">
            <p>
              {errorMessage ||
                "Your payment couldn't be processed. Please try again."}
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
            <button
              onClick={onRetry}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onChangeMethod}
              className="flex-1 bg-white text-red-700 border border-red-300 px-4 py-2 rounded-md text-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Change Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
