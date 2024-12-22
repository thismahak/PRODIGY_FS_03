const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }, // Reference to Product model
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String , required: true }, 
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
      default: false,
    },
    shippingStatus: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'returned'],
      default: 'pending',
    }, // This field will track the shipping status
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

orderSchema.pre('save', function (next) {
  this.totalPrice = this.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  next();
});

module.exports = mongoose.model('Order', orderSchema);
