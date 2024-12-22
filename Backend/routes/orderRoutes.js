const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middlewares/authMiddleware'); // Middleware to verify user authentication
const mongoose = require('mongoose');

router.post('/', protect, async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    console.log('Order Request Body:', req.body);


    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No items in the order' });
    }
    if (!orderItems.every(item => typeof item.qty === 'number' && typeof item.price === 'number' && item.qty > 0 && item.price > 0)) {
        console.log("Validation Failed: Invalid qty or price");
        return res.status(400).json({ message: 'Invalid item quantities or prices' });
    }
    


    // Calculate total price
    const totalPrice = orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    // Set paidAt to null if not paid yet
    const isPaid = req.body.isPaid || false;
    const paidAt = isPaid ? new Date() : null; // Set paidAt to current date if paid, otherwise null

    const order = new Order({
        user: req.user._id, // From the logged-in user
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice, // Use the calculated totalPrice
        isPaid, // Set isPaid based on the request
        paidAt,  // Set paidAt based on isPaid value
    });

    try {
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error });
    }
});


// Route to get logged-in user's orders
router.get('/myorders',protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
        .populate('orderItems.product', 'name price image');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
});


// Route to get an order by ID
router.get('/:id', protect , async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Order ID' });
        }

        const order = await Order.findById(req.params.id).populate('user', 'name email')
        .populate('orderItems.product', 'name price image');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving order', error });
    }
});


module.exports = router;
