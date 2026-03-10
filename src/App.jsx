import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Footer from './components/Footer.jsx';
import HeroCarousel from './components/HeroCarousel.jsx';
import HomePage from './pages/HomePage.jsx';
import Toast from './components/Toast.jsx';
import TechAdvisor from './pages/TechAdvisor.jsx';
import { PrivateRoute, AdminRoute } from './components/RouteGuards.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import NotFound from './pages/NotFound.jsx';
import OrderHistory from './pages/OrderHistory.jsx';


function App() {

  return (
    <BrowserRouter>
      <div className="app_wrapper">

        <Toast />

        <Navbar />
        <main className="main_content_area">
          {/* logic: wrapping the routes in my error boundary. if any page crashes, this catches it globally. */}
          <ErrorBoundary>
            <Routes>
              {/* mapping the url paths to the specific components. */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/advisor" element={<TechAdvisor />} />

              {/* logic: wrapping protected routes in my custom route guard components */}
              <Route element={<PrivateRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-history" element={<OrderHistory />} />
              </Route>

              {/* logic: wrapping strict admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* logic: using the asterisk wildcard route at the very bottom to catch any wrong urls */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App
