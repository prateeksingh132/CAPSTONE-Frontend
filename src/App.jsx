import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Shop from './pages/Shop.jsx';


// logic: making some quick placeholder components so the router has something to render while i build the actual pages later.
const HomePage = () => <h2>HomePage</h2>;
const Cart = () => <h2>Cart</h2>;
const LoginPage = () => <h2>LoginPage</h2>;


function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <main className="main_content_area">
        <Routes>
          {/* mapping the url paths to the specific components. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App
