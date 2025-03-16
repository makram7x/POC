import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";

import Home from "./pages/Home";
import StoreList from "./pages/StoreList";
import StoreDetails from "./pages/StoreDetails";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import { ProductDataProvider } from "./context/ProductDataContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

function App() {
  return (
    <ProductDataProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stores" element={<StoreList />} />
              <Route path="/stores/:id" element={<StoreDetails />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<PaymentSuccess />} />
              <Route
                path="/checkout/failed"
                element={<PaymentFailed errorMessage={"Insuffecient funds"} />}
              />
              {/* We don't need a dedicated route for payment failure since it's handled as a component within the checkout page */}
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </ProductDataProvider>
  );
}

export default App;
