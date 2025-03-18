import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import { CartProvider } from "./context/CartContext";
import { StoreThemeProvider } from "./context/StoreThemeContext";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import StoreList from "./pages/StoreList";
import StoreDetails from "./pages/StoreDetails";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import { ProductDataProvider } from "./context/ProductDataContext";

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      <div
        className={`transition-opacity duration-300 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
        <Router>
          <ProductDataProvider>
            <StoreThemeProvider>
              <CartProvider>
                <Routes>
                  {/* StoreDetails route is outside Layout to hide navbar */}
                  <Route path="/stores/:id" element={<StoreDetails />} />

                  {/* All other routes use Layout component with navbar */}
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/stores" element={<StoreList />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/success" element={<PaymentSuccess />} />
                    <Route
                      path="/checkout/failed"
                      element={
                        <PaymentFailed
                          errorMessage={"Insufficient funds"}
                          onRetry={() => {}}
                          onChangeMethod={() => {}}
                        />
                      }
                    />
                  </Route>
                </Routes>
              </CartProvider>
            </StoreThemeProvider>
          </ProductDataProvider>
        </Router>
      </div>
    </>
  );
};

export default App;
