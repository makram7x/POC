import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useProductData, Store } from "../context/ProductDataContext";

// Enhanced InView hook with more reliable detection
const useInView = (options = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;

    // Forced visibility check as fallback
    const checkVisibility = () => {
      if (currentRef && !isInView) {
        const rect = currentRef.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setIsInView(true);
        }
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (currentRef) observer.unobserve(currentRef);
        }
      },
      {
        threshold: 0.05, // Reduced threshold to trigger earlier
        rootMargin: "0px 0px -10px 0px", // Adjusted to trigger sooner
      }
    );

    if (currentRef) {
      observer.observe(currentRef);

      // Add scroll listener as backup
      window.addEventListener("scroll", checkVisibility, { passive: true });

      // Initial check
      setTimeout(checkVisibility, 300);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
        window.removeEventListener("scroll", checkVisibility);
      }
    };
  }, [isInView]);

  return { ref, isInView };
};

const Home: React.FC = () => {
  const { getAllStores, getStore } = useProductData();
  const [featuredStore, setFeaturedStore] = useState<Store | null>(null);
  const [popularStores, setPopularStores] = useState<Store[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);

  // Create refs for each section
  const heroSection = useInView();
  const featuredSection = useInView();
  const popularSection = useInView();
  const ctaSection = useInView();

  // Delay animations to ensure they're visible
  useEffect(() => {
    // Set a significant initial delay before starting animations
    // This ensures the page has loaded and user has time to focus
    const animationTimer = setTimeout(() => {
      setAnimationsReady(true);
    }, 800); // 800ms delay before any animations start

    return () => clearTimeout(animationTimer);
  }, []);

  useEffect(() => {
    // Get all stores first to ensure data is loaded
    const allStores = getAllStores();
    setPopularStores(allStores);

    // Try to get featured store by ID
    const adidas = getStore("1");

    // If adidas store exists, use it
    if (adidas) {
      setFeaturedStore(adidas);
    }
    // Otherwise use the first store if available
    else if (allStores && allStores.length > 0) {
      setFeaturedStore(allStores[0]);
      console.log("Using first store as featured store");
    }

    // Mark data as loaded
    setDataLoaded(true);

    // Force featured section to be visible after a delay
    setTimeout(() => {
      const featuredEl = document.querySelector(".featured-store-section");
      if (featuredEl) {
        featuredEl.classList.add("force-visible");
      }
    }, 500);
  }, [getStore, getAllStores]);

  // Add CSS for background image styling
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .hero-background {
        background-image: url('/public/mall-bg.jpg');
        background-size: cover;
        background-position: center;
        position: relative;
        width: 100vw;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
      }

      .hero-background::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3));
        z-index: 1;
      }

      .hero-content {
        position: relative;
        z-index: 2;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .hero-image-fade-in {
        animation: fadeIn 1.5s ease-in-out;
      }
      
      /* Initial state for delayed animations */
      .delayed-animation {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.7s ease-out, transform 0.7s ease-out;
      }
      
      /* Animate when ready class is applied */
      .delayed-animation.animate {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(styleSheet);

    // Clean up
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <section
        className="relative overflow-hidden hero-background hero-image-fade-in w-full"
        ref={heroSection.ref}
        style={{ minHeight: "500px" }}
      >
        <div className="container mx-auto px-4 py-16 md:py-32 hero-content">
          <div className="text-center">
            <h1
              className={`text-4xl md:text-6xl font-bold text-white mb-6 delayed-animation ${
                animationsReady ? "animate" : ""
              }`}
              style={{ transitionDelay: "1000ms" }}
            >
              Welcome to Mall App
            </h1>
            <p
              className={`text-lg md:text-xl text-gray-200 mb-8 delayed-animation ${
                animationsReady ? "animate" : ""
              }`}
              style={{ transitionDelay: "1300ms" }}
            >
              Discover your favorite stores and products all in one place
            </p>
            <Link
              to="/stores"
              className={`inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-500 transform hover:scale-105 delayed-animation ${
                animationsReady ? "animate" : ""
              }`}
              style={{ transitionDelay: "1600ms" }}
            >
              Explore Stores
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Store Section - Always rendered but conditionally showing content */}
      <section
        className="py-12 bg-gray-100 featured-store-section"
        ref={featuredSection.ref}
      >
        <div className="container mx-auto px-4">
          <h2
            className={`text-3xl font-semibold text-gray-900 mb-8 text-center transition-all duration-700 transform ${
              (featuredSection.isInView && animationsReady) || dataLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Featured Store
          </h2>

          {featuredStore ? (
            <div
              className={`max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 transform ${
                (featuredSection.isInView && animationsReady) || dataLoaded
                  ? "translate-y-0 opacity-100 scale-100"
                  : "translate-y-20 opacity-0 scale-95"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="md:flex">
                <div className="md:w-1/3 h-64 md:h-auto">
                  <img
                    src={featuredStore.imageUrl}
                    alt={featuredStore.name}
                    className="w-full h-full object-contain p-6 transition-all duration-1000"
                    style={{
                      opacity:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? 1
                          : 0,
                      transform:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? "scale(1)"
                          : "scale(0.9)",
                      transitionDelay: "600ms",
                    }}
                  />
                </div>
                <div className="md:w-2/3 p-8">
                  <h3
                    className="text-2xl font-bold mb-3 transition-all duration-700"
                    style={{
                      opacity:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? 1
                          : 0,
                      transform:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? "translateX(0)"
                          : "translateX(-10px)",
                      transitionDelay: "700ms",
                    }}
                  >
                    {featuredStore.name}
                  </h3>
                  <p
                    className="text-gray-600 mb-6 transition-all duration-700"
                    style={{
                      opacity:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? 1
                          : 0,
                      transform:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? "translateX(0)"
                          : "translateX(-10px)",
                      transitionDelay: "800ms",
                    }}
                  >
                    {featuredStore.description}
                  </p>
                  <div
                    className="mb-4 transition-all duration-700"
                    style={{
                      opacity:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? 1
                          : 0,
                      transform:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? "translateX(0)"
                          : "translateX(-10px)",
                      transitionDelay: "900ms",
                    }}
                  >
                    <h4 className="text-lg font-semibold mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {featuredStore.categories.map((category, index) => (
                        <span
                          key={category}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm transition-all duration-500 transform"
                          style={{
                            opacity:
                              (featuredSection.isInView && animationsReady) ||
                              dataLoaded
                                ? 1
                                : 0,
                            transform:
                              (featuredSection.isInView && animationsReady) ||
                              dataLoaded
                                ? "scale(1)"
                                : "scale(0.5)",
                            transitionDelay: `${1000 + index * 100}ms`,
                          }}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/stores/${featuredStore.id}`}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-all duration-500 transform hover:scale-105"
                    style={{
                      opacity:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? 1
                          : 0,
                      transform:
                        (featuredSection.isInView && animationsReady) ||
                        dataLoaded
                          ? "translateY(0)"
                          : "translateY(10px)",
                      transitionDelay: "1200ms",
                    }}
                  >
                    Visit Store
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center opacity-100">
              <p className="text-lg text-gray-600">Loading featured store...</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Stores Section */}
      <section className="py-12 bg-gray-50" ref={popularSection.ref}>
        <div className="container mx-auto px-4">
          <h2
            className={`text-3xl font-semibold text-gray-900 mb-8 text-center transition-all duration-700 transform ${
              popularSection.isInView && animationsReady
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Popular Stores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularStores.map((store, index) => (
              <div
                key={store.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-700 transform ${
                  popularSection.isInView && animationsReady
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-20 scale-95"
                }`}
                style={{ transitionDelay: `${500 + index * 150}ms` }}
              >
                <div className="h-48 overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={store.imageUrl}
                    alt={store.name}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {store.description.length > 100
                      ? `${store.description.substring(0, 100)}...`
                      : store.description}
                  </p>
                  <Link
                    to={`/stores/${store.id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center transition-all duration-300 hover:translate-x-1"
                  >
                    View Store{" "}
                    <span className="ml-1 transition-transform duration-300">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="bg-blue-600 text-white py-16 overflow-hidden"
        ref={ctaSection.ref}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 transform ${
              ctaSection.isInView && animationsReady
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Start Shopping Today
          </h2>
          <p
            className={`text-xl mb-8 transition-all duration-700 transform ${
              ctaSection.isInView && animationsReady
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            Browse our collection of stores and find what you need
          </p>
          <Link
            to="/stores"
            className={`inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-all duration-500 transform hover:scale-105 ${
              ctaSection.isInView && animationsReady
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            View All Stores
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
