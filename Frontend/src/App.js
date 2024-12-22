import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import Header from './components/Header'; // Header component import
import ProductDetails from './components/ProductDetails';
import './App.css'; // Importing CSS
import CheckoutPage from './components/Checkout';
import ProfilePage from './pages/ProfilePage';
import { useState } from 'react';


function App() {
  
  const [user, setUser] = useState(null);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
 
    
    
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout}/> {/* This will be visible on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage setUser={setUser}/>} /> {/* Register route */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage/>}/>
        <Route path="/profile" element={<ProfilePage user={user} />} /> {/* Profile Route */}
      </Routes>
    </Router>
  );
}

export default App;
