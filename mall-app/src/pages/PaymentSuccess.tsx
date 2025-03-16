import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface OrderSummary {
  orderId: string;
  date: string;
  total: number;
  items: number;
  email: string;
}

const PaymentSuccess: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderSummary>({
    orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toLocaleDateString(),
    total: 109.97, // This would normally come from your order context/state
    items: 3,
    email: "customer@example.com", // This would normally come from user context/state
  });

  useEffect(() => {
    // Animation delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // Cleanup - remove animation styles when component unmounts
    return () => {
      const styleElement = document.getElementById("success-animations");
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Add animation styles to head
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.id = "success-animations";
    styleSheet.textContent = `
      @keyframes checkmarkDraw {
        0% {
          stroke-dashoffset: 66;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      
      @keyframes circleGrow {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      @keyframes fadeUpIn {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-checkmark {
        stroke-dasharray: 66;
        stroke-dashoffset: 66;
        animation: checkmarkDraw 0.8s ease-in-out forwards 0.3s;
      }
      
      .animate-circle {
        transform-origin: center;
        animation: circleGrow 0.5s ease-out forwards;
      }
      
      .animate-fadeUpIn {
        animation: fadeUpIn 0.5s ease-out forwards;
        opacity: 0;
      }
    `;
    document.head.appendChild(styleSheet);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gray-50 py-12 px-4 transition-opacity duration-500 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Success Icon */}
          <div className="bg-green-500 flex justify-center py-8">
            <div className="w-24 h-24 relative">
              <svg
                className="w-full h-full animate-circle"
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" r="48" fill="white" />
              </svg>
              <svg
                className="w-full h-full absolute inset-0"
                viewBox="0 0 100 100"
              >
                <path
                  className="animate-checkmark"
                  d="M30 50 L45 65 L70 35"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h1
              className="text-2xl font-bold text-center text-gray-900 mb-2 animate-fadeUpIn"
              style={{ animationDelay: "0.2s" }}
            >
              Payment Successful!
            </h1>
            <p
              className="text-center text-gray-600 mb-8 animate-fadeUpIn"
              style={{ animationDelay: "0.3s" }}
            >
              Your order has been placed and is being processed.
            </p>

            {/* Order Details */}
            <div
              className="border border-gray-200 rounded-lg p-6 mb-8 animate-fadeUpIn"
              style={{ animationDelay: "0.4s" }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{orderDetails.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span>{orderDetails.items}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">
                    ${orderDetails.total.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    A confirmation email has been sent to{" "}
                    <span className="font-medium">{orderDetails.email}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex flex-col space-y-3 animate-fadeUpIn"
              style={{ animationDelay: "0.5s" }}
            >
              <Link
                to="/orders"
                className="w-full bg-blue-600 text-center text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Order Details
              </Link>
              <Link
                to="/"
                className="w-full bg-gray-100 text-center text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Track Order Card */}
        <div
          className="mt-8 bg-white p-6 rounded-lg shadow-md animate-fadeUpIn"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Track Your Order
              </h3>
              <p className="mt-1 text-gray-600">
                You can track your order status and shipping details from your
                account dashboard.
              </p>
              <Link
                to="/account"
                className="mt-3 inline-block text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Go to My Account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
