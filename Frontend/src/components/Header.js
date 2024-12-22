import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';  // Import the CSS for the Header component

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="logo-link">
          <h1>E-Shop</h1>
        </Link>
      </div>
      
      <nav className="nav">
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/cart" className="nav-link">Cart</Link></li>
          <li><Link to="/order" className="nav-link">Order</Link></li> {/* Order Link */}
          {user ? (
            <>
            <li><Link to="/profile" className="nav-link">Profile</Link></li>
            <li><button className="logout-btn" onClick={onLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-link">Login</Link></li>
              <li><Link to="/register" className="nav-link">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
