import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  PayPalButtons,
  PayPalScriptProvider,
  FUNDING,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import PaymentFailed from "./PaymentFailed";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PayPalOrderDetails {
  id: string;
  status: string;
  payer: {
    email_address: string;
  };
}

interface CreditCardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "credit">(
    "paypal"
  );
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [failureReason, setFailureReason] = useState("");

  // Credit card form state
  const [creditCardDetails, setCreditCardDetails] = useState<CreditCardDetails>(
    {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    }
  );
  const [creditCardErrors, setCreditCardErrors] = useState<
    Partial<CreditCardDetails>
  >({});

  const { items: cartItems, clearCart } = useCart();

  useEffect(() => {
    // Set a small delay to allow for the initial loading animation
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 300);
  }, []);

  // Listen for PayPal script loading errors
  useEffect(() => {
    const handleScriptError = () => {
      console.error("PayPal script failed to load");
      setError(
        "Payment service is temporarily unavailable. Please try again later."
      );
    };

    window.addEventListener("paypal-script-error", handleScriptError);

    return () => {
      window.removeEventListener("paypal-script-error", handleScriptError);
    };
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + tax;

  const handlePaymentSuccess = async (
    details: PayPalOrderDetails | CreditCardDetails
  ) => {
    setIsProcessing(true);
    setError(null);
    setPaymentFailed(false);

    try {
      // Store order details and clear cart
      const orderSummary = {
        orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toLocaleDateString(),
        total: total,
        items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        email: ('payer' in details) ? details.payer.email_address : "customer@example.com"
      };
      sessionStorage.setItem('orderSummary', JSON.stringify(orderSummary));
      console.log("Payment successful:", details);
      clearCart();
      setTimeout(() => {
        navigate("/checkout/success");
      }, 1000); // Delay for animation
    } catch (error) {
      handlePaymentError({
        message: "Failed to process payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (err: Record<string, unknown>) => {
    setIsProcessing(false);
    setPaymentFailed(true);
    setFailureReason(
      (err.message as string) || "Payment failed. Please try again."
    );
    console.error("Payment error:", err);
  };

  const handleRetryPayment = () => {
    setPaymentFailed(false);
    setError(null);
    // Additional logic if needed for retrying
  };

  const handleChangePaymentMethod = () => {
    setPaymentFailed(false);
    setError(null);
    setPaymentMethod(paymentMethod === "paypal" ? "credit" : "paypal");
  };

  // Credit card handlers
  const handleCreditCardInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Format credit card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "") // Remove existing spaces
        .replace(/\D/g, "") // Remove non-digits
        .replace(/(\d{4})(?=\d)/g, "$1 "); // Add space after every 4 digits

      setCreditCardDetails({
        ...creditCardDetails,
        [name]: formattedValue.substring(0, 19), // Limit to 16 digits + 3 spaces
      });
      return;
    }

    // Format expiry date with slash
    if (name === "expiryDate") {
      let formattedValue = value.replace(/\D/g, "");

      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4);
      }

      setCreditCardDetails({
        ...creditCardDetails,
        [name]: formattedValue.substring(0, 5),
      });
      return;
    }

    // Format CVV (numbers only, max 4 digits)
    if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "");
      setCreditCardDetails({
        ...creditCardDetails,
        [name]: formattedValue.substring(0, 4),
      });
      return;
    }

    setCreditCardDetails({
      ...creditCardDetails,
      [name]: value,
    });
  };

  const validateCreditCardForm = (): boolean => {
    const errors: Partial<CreditCardDetails> = {};

    // Validate card number (16 digits, spaces allowed)
    if (creditCardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      errors.cardNumber = "Please enter a valid 16-digit card number";
    }

    // Validate expiry date (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(creditCardDetails.expiryDate)) {
      errors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    } else {
      // Check if card is expired
      const [month, year] = creditCardDetails.expiryDate.split("/");
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();

      if (expiryDate < currentDate) {
        errors.expiryDate = "Card has expired";
      }
    }

    // Validate CVV (3-4 digits)
    const cvvLength = creditCardDetails.cvv.length;
    if (cvvLength < 3 || cvvLength > 4) {
      errors.cvv = "Please enter a valid CVV (3-4 digits)";
    }

    // Validate cardholder name
    if (creditCardDetails.cardholderName.trim().length < 3) {
      errors.cardholderName = "Please enter the cardholder's name";
    }

    setCreditCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreditCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateCreditCardForm()) {
      setIsProcessing(true);
      setPaymentFailed(false);

      // Simulate payment processing with a delay
      setTimeout(() => {
        // In a real implementation, this would be an API call to a payment processor
        const randomSuccess = Math.random() > 0.2; // 80% success rate for demo purposes

        if (randomSuccess) {
          handlePaymentSuccess({
            id: `cc-${Date.now()}`,
            status: "COMPLETED",
            payer: {
              email_address: "customer@example.com",
            },
          } as PayPalOrderDetails);
        } else {
          // Simulate different failure reasons
          const failureReasons = [
            "Transaction declined by your bank. Please try another card.",
            "Insufficient funds. Please use a different payment method.",
            "Card verification failed. Please check your card details.",
          ];
          const randomReason =
            failureReasons[Math.floor(Math.random() * failureReasons.length)];
          handlePaymentError({ message: randomReason });
        }
      }, 1500);
    }
  };

  // Use a sandbox client ID for development - IMPORTANT: replace with your real client ID in .env file
  // Hardcoding "sb" as fallback which is PayPal's standard test client ID
  const clientId = "sb";

  const paypalOptions: ReactPayPalScriptOptions = {
    clientId,
    currency: "USD",
    intent: "capture",
    components: "buttons",
    enableStandardCardFields: true,
    // Don't include function callbacks in the options
    // They need to be handled separately
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 py-8 transition-opacity duration-500 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-slideInFromTop">
          Checkout
        </h1>

        <div
          className="bg-white rounded-lg shadow-md p-6 mb-6 animate-slideInFromLeft"
          style={{ animationDelay: "0.2s" }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>

          {/* Order Items */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2 animate-fadeIn"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600 ml-2">x{item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div
            className="space-y-2 animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="animate-highlight">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div
          className="bg-white rounded-lg shadow-md p-6 animate-slideInFromRight"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Payment Method
          </h2>

          {/* Display Payment Failed Component */}
          {paymentFailed && (
            <PaymentFailed
              errorMessage={failureReason}
              onRetry={handleRetryPayment}
              onChangeMethod={handleChangePaymentMethod}
            />
          )}

          {/* Payment Method Selection */}
          <div className="mb-6 flex space-x-4 animate-fadeIn">
            <button
              onClick={() => setPaymentMethod("paypal")}
              className={`flex-1 py-2 px-4 rounded-lg border transition-all 
                ${
                  paymentMethod === "paypal"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
            >
              PayPal
            </button>
            <button
              onClick={() => setPaymentMethod("credit")}
              className={`flex-1 py-2 px-4 rounded-lg border transition-all 
                ${
                  paymentMethod === "credit"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
            >
              Credit Card
            </button>
          </div>

          {error && !paymentFailed && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 animate-shake">
              {error}
            </div>
          )}

          <div
            className={`max-w-md mx-auto transition-opacity duration-300 ${
              isProcessing ? "opacity-60" : "opacity-100"
            }`}
          >
            {error && error.includes("temporarily unavailable") ? (
              <div className="p-4 border border-gray-300 rounded-lg text-center">
                <p className="mb-4">
                  Payment service is temporarily unavailable.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : paymentMethod === "paypal" ? (
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                  fundingSource={FUNDING.PAYPAL}
                  style={{ layout: "vertical" }}
                  disabled={isProcessing}
                  forceReRender={[total.toString()]}
                  createOrder={(_, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: total.toFixed(2),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (_, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture();
                      await handlePaymentSuccess(details as PayPalOrderDetails);
                    }
                  }}
                  onError={(err) => {
                    handlePaymentError({
                      message:
                        "PayPal payment failed. Please try again or use a different payment method.",
                    });
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <div className="animate-fadeIn">
                <form onSubmit={handleCreditCardSubmit}>
                  {/* Card Number */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={creditCardDetails.cardNumber}
                      onChange={handleCreditCardInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        creditCardErrors.cardNumber
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                      }`}
                      disabled={isProcessing}
                    />
                    {creditCardErrors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {creditCardErrors.cardNumber}
                      </p>
                    )}
                  </div>

                  {/* Expiry Date and CVV */}
                  <div className="flex space-x-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={creditCardDetails.expiryDate}
                        onChange={handleCreditCardInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          creditCardErrors.expiryDate
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                        }`}
                        disabled={isProcessing}
                      />
                      {creditCardErrors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {creditCardErrors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        placeholder="123"
                        value={creditCardDetails.cvv}
                        onChange={handleCreditCardInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          creditCardErrors.cvv
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                        }`}
                        disabled={isProcessing}
                      />
                      {creditCardErrors.cvv && (
                        <p className="text-red-500 text-xs mt-1">
                          {creditCardErrors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      placeholder="John Doe"
                      value={creditCardDetails.cardholderName}
                      onChange={handleCreditCardInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        creditCardErrors.cardholderName
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                      }`}
                      disabled={isProcessing}
                    />
                    {creditCardErrors.cardholderName && (
                      <p className="text-red-500 text-xs mt-1">
                        {creditCardErrors.cardholderName}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex justify-center"
                  >
                    {isProcessing ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Pay $${total.toFixed(2)}`
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these CSS animations to your global CSS or use a CSS-in-JS solution
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInFromTop {
    from { opacity: 0; transform: translateY(-30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideInFromLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slideInFromRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes highlight {
    0% { background-color: transparent; }
    30% { background-color: rgba(96, 165, 250, 0.2); }
    100% { background-color: transparent; }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slideInFromTop {
    animation: slideInFromTop 0.5s ease-out forwards;
  }
  
  .animate-slideInFromLeft {
    animation: slideInFromLeft 0.5s ease-out forwards;
  }
  
  .animate-slideInFromRight {
    animation: slideInFromRight 0.5s ease-out forwards;
  }
  
  .animate-highlight {
    animation: highlight 2s ease-in-out infinite;
  }
  
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
`;
document.head.appendChild(styleSheet);

export default Checkout;
