const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [itemSchema],
    totalPrice: { type: Number,required: true , default: 0 },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

cartSchema.pre('save', async function (next) {
    const Product = mongoose.model('Product');
    let total = 0;

    for (const item of this.items) {
        const product = await Product.findById(item.productId);
        if (product && product.price) {  // Ensure product has a valid price
            total += product.price * item.quantity;
        } else {
            // Handle error or invalid product scenario
            console.error(`Product not found or price is invalid for productId: ${item.productId}`);
        }
    }

    this.totalPrice = isNaN(total) ? 0 : total;
    next();
});


module.exports = mongoose.model('Cart', cartSchema);
