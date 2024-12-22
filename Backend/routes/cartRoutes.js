const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middlewares/authMiddleware');

// Get cart by logged-in user
router.get('/', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId', 'name price image');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
          }
          

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add or update cart item
router.post('/', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid product ID or quantity' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const existingItem = cart.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        const productPrices = new Map();

        const productPromises = cart.items.map(async (item) => {
            if (!productPrices.has(item.productId.toString())) {
                const product = await Product.findById(item.productId); // Fetch product
                productPrices.set(item.productId.toString(), product.price); // Cache price
            }
            return productPrices.get(item.productId.toString()) * item.quantity;
        });
        
        const itemPrices = await Promise.all(productPromises);
        cart.totalPrice = itemPrices.reduce((total, price) => total + price, 0);
        


        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/:id', protect, async (req, res) => {
    try {
        const  productId = req.params.id;
        const userId = req.user.id;

        console.log("Removing product ID:", productId); // Debug log
    console.log("For user ID:", userId); // Debug log

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const updatedItems = cart.items.filter(item => item.productId.toString() !== productId);

        if (updatedItems.length === cart.items.length) {
            return res.status(400).json({ message: 'Product not found in cart' }); // Handle case where product doesn't exist in cart
        }

        cart.items = updatedItems;

        // Recalculate total price
        cart.totalPrice = 0;
        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            cart.totalPrice += product.price * item.quantity;
        }

        await cart.save();
        console.log("Updated Cart:", cart); // Debug log
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error while removing product:", error);
    res.status(500).json({ message: "Server error" });
    }
});


// Clear cart for the logged-in user
router.delete('/', protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (cart) {
            cart.items = []; // Clear all items
            cart.totalPrice = 0; // Reset total price
            await cart.save();
            res.status(200).json({ message: 'Cart cleared successfully' });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error });
    }
});




module.exports = router;
