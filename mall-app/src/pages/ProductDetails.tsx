import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProductData, Product } from "../context/ProductDataContext";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart();
  const { getProduct } = useProductData();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = getProduct(id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false);
      // Delay to allow for animation
      setTimeout(() => {
        setPageLoaded(true);
      }, 100);
    }
  }, [id, getProduct]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Add the item with the current quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        storeId: product.storeId,
      });
    }

    // Show success message with animation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-blue-400 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-blue-400 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-400 rounded"></div>
              <div className="h-4 bg-blue-400 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <p className="text-red-500 animate-bounce">Product not found</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 py-4 transition-opacity duration-500 ${
        pageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-3">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row">
            {/* Product Image */}
            <div className="md:w-1/2 animate-fadeIn">
              <div className="overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 md:h-96 object-contain rounded-t-lg md:rounded-l-lg md:rounded-t-none transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-4 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4 animate-slideInFromRight">
                {product.name}
              </h1>
              <p
                className="text-gray-600 text-base md:text-lg mb-4 md:mb-6 animate-slideInFromRight"
                style={{ animationDelay: "0.1s" }}
              >
                {product.description}
              </p>

              {product.details && (
                <div
                  className="mb-4 md:mb-6 animate-slideInFromRight"
                  style={{ animationDelay: "0.2s" }}
                >
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    Product Details
                  </h2>
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Brand:</span>{" "}
                      {product.details.brand}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Material:</span>{" "}
                      {product.details.material}
                    </p>
                    <div className="mt-2 md:mt-4">
                      <span className="font-medium">Features:</span>
                      <ul className="list-disc list-inside mt-1 md:mt-2 text-gray-600">
                        {product.details.features.map((feature, index) => (
                          <li
                            key={index}
                            className="animate-fadeIn"
                            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div
                className="border-t border-gray-200 pt-4 md:pt-6 animate-slideInFromBottom"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
                  <span className="text-xl md:text-2xl font-bold text-blue-600 animate-pulseOnce">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Quantity:</span>
                    <div className="flex items-center border rounded overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="px-3 py-1 border-r hover:bg-gray-100 text-gray-900 dark:text-white transition-colors duration-200"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 w-10 text-center transition-all duration-200">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="px-3 py-1 border-l hover:bg-gray-100 text-gray-900 dark:text-white transition-colors duration-200"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-lg transition-all duration-300 relative overflow-hidden transform ${
                    addedToCart
                      ? "bg-green-500 text-white animate-pulse"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                  }`}
                >
                  <span className="relative z-10">
                    {addedToCart ? "Added to Cart!" : "Add to Cart"}
                  </span>
                  {!addedToCart && (
                    <span className="absolute bottom-0 left-0 w-full h-0 bg-blue-800 transition-all duration-300 group-hover:h-full -z-0"></span>
                  )}
                </button>
              </div>
            </div>
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
  
  @keyframes slideInFromRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slideInFromBottom {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulseOnce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slideInFromRight {
    animation: slideInFromRight 0.5s ease-out forwards;
  }
  
  .animate-slideInFromBottom {
    animation: slideInFromBottom 0.5s ease-out forwards;
  }
  
  .animate-pulseOnce {
    animation: pulseOnce 1s ease-in-out;
  }
`;
document.head.appendChild(styleSheet);

export default ProductDetails;
