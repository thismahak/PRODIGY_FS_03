import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CartPage.css'; // Import custom styles
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingItem, setRemovingItem] = useState(false);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load cart data');
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    setRemovingItem(true);
    console.log("Product ID to remove:", productId);
    try {
      
      const token = localStorage.getItem('token');
      const {data} = await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setCart(data);
      alert('Item removed from cart!');
    } catch (err) {
      console.error('Error removing item from cart:', err);
    alert('Failed to remove item from cart');
    }
    finally {
      setRemovingItem(false);
    }
  };

  if (loading) return <div className="loading">Loading your cart...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      {cart?.items?.length === 0 ? (
        <p className="empty-cart">Your cart is empty. <a href="/">Shop now</a>.</p>
      ) : (
        <div className="cart-container">
          {cart.items.map((item) => (
            <div key={item.productId._id} className="cart-item">
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.productId.name}</h3>
                <p>Price: ${item.productId.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => handleRemoveItem(item.productId._id)}
                disabled={removingItem}
              >
                {removingItem ? 'Removing...' : 'Remove'}
              </button>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ${cart.totalPrice}</h3>
            <button className="checkout-btn"
            onClick={() => navigate('/checkout')}
            >Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
