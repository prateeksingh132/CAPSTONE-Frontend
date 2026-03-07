import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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



function App() {

  return (
    <BrowserRouter>
      <div className="app_wrapper">

        <Toast />

        <Navbar />
        <main className="main_content_area">
          <Routes>
            {/* mapping the url paths to the specific components. */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App
