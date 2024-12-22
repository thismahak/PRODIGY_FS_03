const express = require('express');
const app = express();
const dotenv = require('dotenv');
const dbConnect = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminProductRoutes = require('./routes/adminProducts');
const adminOrderRoutes = require('./routes/adminOrder');
const adminAssignRoute = require('./routes/adminAssign');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorMiddlewares');

dotenv.config();
dbConnect();

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Log HTTP requests in development
app.use(express.urlencoded({ extended: true }));

// User and general routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Admin routes
app.use('/api/admin' , adminAssignRoute );
app.use('/api/admin/products', adminProductRoutes);  // Products management for admins
app.use('/api/admin/orders', adminOrderRoutes);      // Orders management for admins


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
