const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protectAdmin } = require('../middlewares/adminMiddleware');

// Route to get all orders
router.get('/', protectAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
});

// Route to update an order status (e.g., "shipped", "delivered")
router.put('/:id', protectAdmin, async (req, res) => {
    const { isPaid, paidAt, shippingStatus } = req.body;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { isPaid, paidAt, shippingStatus },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
});

module.exports = router;
