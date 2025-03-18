import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProductData, Product, Store } from "../context/ProductDataContext";
import { useStoreTheme } from "../context/StoreThemeContext";
import CartIcon from "../components/CartIcon";

/**
 * Revamped StoreDetails page with a full-width header card and no navbar
 */
const StoreDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { getStore, getStoreProducts } = useProductData();
  const { applyTheme, colors } = useStoreTheme();

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const foundStore = getStore(id);
      if (foundStore) {
        setStore(foundStore);
        const storeProducts = getStoreProducts(id);
        setProducts(storeProducts);
        applyTheme(foundStore.imageUrl);
      }
      setLoading(false);
    }
  }, [id, getStore, getStoreProducts, applyTheme]);

  // Handle back navigation
  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--color-background]">
        <p className="text-[--color-text]">Loading store information...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--color-background]">
        <div className="text-center">
          <p className="text-[--color-text] mb-4">Store not found</p>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 rounded-lg text-white bg-[--color-primary]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === "all" || product.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[--color-background]">
      {/* Custom top navigation for store detail page only */}
      <div className="flex justify-between items-center p-4 bg-[--color-background] relative z-20">
        <button
          onClick={handleBackClick}
          className="flex items-center text-[--color-text] hover:text-[--color-primary] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        <Link to="/cart" className="relative">
          <CartIcon />
        </Link>
      </div>

      {/* Store Header Card - Mobile optimized */}
      <header className="w-full bg-white shadow-lg rounded-3xl overflow-hidden relative z-10 -mt-4 pt-4">
        <div className="p-5 md:p-8">
          <div className="flex flex-col gap-5">
            <div className="w-full h-72 rounded-lg bg-white flex justify-center items-center">
              <img
                src={store.imageUrl}
                alt={store.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-[--color-text]">
                {store.name}
              </h1>
              <p className="text-base mb-5 text-[--color-secondary]">
                {store.description}
              </p>

              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-[--color-primary] text-white"
                      : "bg-transparent border border-[--color-secondary] text-[--color-text]"
                  }`}
                >
                  All Products
                </button>

                {/* Visual separator */}
                <div className="h-5 w-px bg-gray-300 mx-1"></div>

                <div className="flex flex-wrap gap-2">
                  {store.categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-[--color-primary] text-white"
                          : "bg-transparent border border-[--color-primary] text-[--color-primary]"
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Products Section */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Products List (mobile optimized) */}
        <div className="space-y-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col sm:flex-row"
            >
              <div className="w-full sm:w-48 h-56 sm:h-48">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-5 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-[--color-text]">
                  {product.name}
                </h3>
                <p className="mb-4 text-[--color-secondary] line-clamp-2">
                  {product.description}
                </p>
                <div className="flex mt-auto justify-between items-center">
                  <span className="text-lg font-bold text-[--color-primary]">
                    ${product.price.toFixed(2)}
                  </span>
                  <Link
                    to={`/products/${product.id}`}
                    className="px-4 py-2.5 rounded-lg text-white transition-colors hover:opacity-90 bg-[--color-primary]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[--color-secondary]">
              No products found in this category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoreDetails;
