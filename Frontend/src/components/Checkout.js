import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const CheckoutPage = () => {
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
  
      // Fetch cart items
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const cartItems = response.data?.items.map(item => ({
        product: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        price: Number(item.productId.price),
        qty: Number(item.quantity),
      })) || [];
  
      if (cartItems.length === 0) {
        alert('Your cart is empty. Add items to place an order.');
        return;
      }
  
      // Place order
      const orderResponse = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cartItems,
          shippingAddress: {
            city: shippingAddress.city,
            address: shippingAddress.address,
            country: shippingAddress.country,
            postalCode: shippingAddress.postalCode,
          },
          paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (orderResponse.status === 201) {
        console.log('Order Response:', orderResponse.data);

        const clearCartResponse = await axios.delete('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

  
        if (clearCartResponse.status === 200) {
          console.log('Cart Clear Response:', clearCartResponse.data);
          alert('Order placed successfully! Your cart has been cleared.');
        } else {
          console.error('Failed to clear cart:', clearCartResponse.data);
          alert('Order placed, but failed to clear cart. Please refresh and check.');
        }

        navigate('/orders');
      } else {
        console.error('Unexpected Order Response:', orderResponse);
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error.response?.data || error.message);
      alert('Failed to place order. Please try again.');
    }
  };
  
  

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-form">
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            id="address"
            name="address"
            type="text"
            value={shippingAddress.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            id="city"
            name="city"
            type="text"
            value={shippingAddress.city}
            onChange={handleInputChange}
            placeholder="Enter your city"
          />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code:</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={shippingAddress.postalCode}
            onChange={handleInputChange}
            placeholder="Enter your postal code"
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <input
            id="country"
            name="country"
            type="text"
            value={shippingAddress.country}
            onChange={handleInputChange}
            placeholder="Enter your country"
          />
        </div>
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="PayPal">PayPal</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>
        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
