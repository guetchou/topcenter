const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { createConnection } = require('./db/connection');
const logger = require('./utils/logger');

dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const newsRoutes = require('./routes/news');
const articleRoutes = require('./routes/articles');
const categoryRoutes = require('./routes/categories');
const menuRoutes = require('./routes/menus');
const mediaRoutes = require('./routes/medias');
const systemRoutes = require('./routes/system');
const uploadRoutes = require('./routes/upload');
const dbExplorerRouter = require('./routes/db-explorer');

// Initialize the app
const app = express();

// Enable CORS
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request rate
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Parse JSON request bodies
app.use(express.json());

// Log HTTP requests
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database connection
createConnection().then(() => {
  logger.info('Database connection established');
}).catch((err) => {
  logger.error('Failed to connect to the database:', err);
  process.exit(1); // Exit the process if the database connection fails
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/medias', mediaRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/db-explorer', dbExplorerRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
