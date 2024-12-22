import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderPage.css';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading your orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-page">
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p className="no-orders">You have no orders. <a href="/">Shop now</a>.</p>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <h3>Order ID: {order._id}</h3>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${order.totalPrice}</p>
              <p><strong>Status:</strong> {order.shippingStatus || 'Pending'}</p>
              <div className="order-products">
                <h4>Products:</h4>
                {order.orderItems.map((item) => (
                  <div key={item.product._id} className="order-product">
                    <img src={item.product.image} alt={item.product.name} className="order-product-image" />
                    <div>
                      <p><strong>{item.product.name}</strong></p>
                      <p>Quantity: {item.qty}</p>
                      <p>Price: ${item.product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
