import React from 'react';
import './ProductCard.css'; // Import custom styles for the product card
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate(); 
  const { name, price, image, description , _id} = product;

    // Logic to add the product to the cart
    const handleAddToCart = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure the user is logged in
        if (!token) {
          alert("Please log in to add items to the cart.");
          return;
        }
    
        const response = await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: _id, quantity: 1 }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to add product to cart');
        }
    
        
        alert(`Added ${name} to the cart.`);
      } catch (error) {
        console.error(error);
        alert('An error occurred while adding to cart.');
      }
    };
    
    
  

  const handleViewDetails = () => {
    // Logic to view the product details (can route to product detail page)
    
      navigate(`/product/${_id}`);
    
  
  };

  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-details">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <span className="product-price">${price}</span>
          <div className="product-actions">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="view-details-btn" onClick={handleViewDetails}>
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
