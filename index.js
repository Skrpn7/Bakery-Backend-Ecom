const express = require('express');
const winston = require('winston');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger');

const db = require('./models'); 

const app = express();
const port = process.env.PORT || 5001;

// Serve React build
app.use(express.static(path.join(__dirname, 'client/build')));

// Middleware
app.use(cors());
app.use(express.json());

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }),
    new winston.transports.Console()
  ]
});

// Swagger setup
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const productRoutes = require('./routes/product.routes');
app.use('/products', productRoutes);

const imageRoutes = require('./routes/image.routes');
app.use('/image', imageRoutes);

const orderDetailsRoutes = require('./routes/orderDetails.routes');
app.use('/OrderDetail', orderDetailsRoutes);



// React fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start server and DB connection
app.listen(port, async () => {
  logger.info(`Server is running on port ${port}`);

  try {
    await db.sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    await db.sequelize.sync();
    logger.info('Database synced.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
});

module.exports = { app, logger };
