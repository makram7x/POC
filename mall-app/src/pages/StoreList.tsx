import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductData, Store } from "../context/ProductDataContext";

const StoreList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { getAllStores } = useProductData();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const allStores = getAllStores();
    setIsLoading(true);
    // Simulate loading for smoother transitions
    setTimeout(() => {
      setStores(allStores);
      setIsLoading(false);
    }, 300);
  }, [getAllStores]);

  // Animation when changing category
  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    // Short delay to allow fade-out before filtering
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Get unique categories from all stores
  const allCategories = [
    "all",
    ...new Set(stores.flatMap((store) => store.categories)),
  ];

  // Filter stores based on whether they have the selected category
  const filteredStores =
    selectedCategory === "all"
      ? stores
      : stores.filter((store) => store.categories.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fadeIn">
          Our Stores
        </h1>

        {/* Category Filter with hover animations */}
        <div
          className="mb-8 animate-slideInFromTop"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category, index) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stores Grid with staggered fade-in */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          {filteredStores.map((store, index) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 animate-fadeIn"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img
                  src={store.imageUrl}
                  alt={store.name}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {store.name}
                </h2>
                <p className="text-gray-600 mb-4">{store.description}</p>
                <Link
                  to={`/stores/${store.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-blue-700 relative overflow-hidden group"
                >
                  <span className="relative z-10">Visit Store</span>
                  <span className="absolute top-0 left-0 w-full h-0 bg-blue-800 transition-all duration-300 group-hover:h-full -z-0"></span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State with fade animation */}
        {filteredStores.length === 0 && (
          <div className="text-center py-12 animate-fadeIn">
            <p className="text-gray-600 text-lg">
              No stores found in this category.
            </p>
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
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideInFromTop {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slideInFromTop {
    animation: slideInFromTop 0.5s ease-out forwards;
  }
`;
document.head.appendChild(styleSheet);

export default StoreList;
