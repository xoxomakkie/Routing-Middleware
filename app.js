const express = require('express');
const itemsRoutes = require('./itemsRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/items', itemsRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404 for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
