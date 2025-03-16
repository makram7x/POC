import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, totalItems, totalPrice } =
    useCart();
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setRemovingItemId(itemId);
    // Delay actual removal to allow animation to complete
    setTimeout(() => {
      removeItem(itemId);
      setRemovingItemId(null);
    }, 300);
  };

  const subtotal = totalPrice;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 animate-fadeIn">
      <div className="container mx-auto px-3 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8 animate-slideInFromLeft">
          Shopping Cart
        </h1>

        {totalItems > 0 ? (
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Cart Items */}
            <div
              className="lg:w-2/3 animate-slideInFromBottom"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="bg-white rounded-lg shadow-md">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex flex-col p-4 border-b border-gray-200 last:border-b-0 transition-all duration-300 animate-fadeIn ${
                      removingItemId === item.id
                        ? "opacity-0 transform -translate-x-full"
                        : ""
                    }`}
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {item.image && (
                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain rounded transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <Link
                          to={`/stores/${item.storeId}`}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          View Store
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center border rounded overflow-hidden">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="px-3 py-1 border-r hover:bg-gray-100 text-gray-900 dark:text-white transition-colors duration-200"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1 border-l hover:bg-gray-100 text-gray-900 dark:text-white transition-colors duration-200"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-base md:text-lg font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all duration-300 transform hover:scale-105"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div
              className="lg:w-1/3 mt-4 lg:mt-0 animate-slideInFromBottom"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 transition-transform duration-300 hover:shadow-lg">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4 md:mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10">Proceed to Checkout</span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-blue-800 transition-all duration-300 group-hover:h-full -z-0"></span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 md:py-12 bg-white rounded-lg shadow-md animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8">
              Browse our stores and add some items to your cart
            </p>
            <Link
              to="/stores"
              className="inline-block bg-blue-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        )}
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
  
  @keyframes slideInFromLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slideInFromBottom {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slideInFromLeft {
    animation: slideInFromLeft 0.5s ease-out forwards;
  }
  
  .animate-slideInFromBottom {
    animation: slideInFromBottom 0.5s ease-out forwards;
  }
`;
document.head.appendChild(styleSheet);

export default Cart;
