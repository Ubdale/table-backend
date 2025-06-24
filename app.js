const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const todoRoutes = require('./routes/todo-routes')
const tableConfigRoutes = require('./routes/table-config-routes')
var cors = require('cors')

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Todo API is running',
    version: '1.0.0',
    endpoints: {
      todos: '/todo',
      tableConfig: '/table-config'
    }
  })
})

// Routes
app.use('/', todoRoutes);
app.use('/', tableConfigRoutes);

// Database connection
async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://ubdaleuddin:D4MZHZibZl7MVZ0K@cluster0.sas4xpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            dbName: 'todo-data',
        });
        console.log('Connected to MongoDB Atlas successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Todo app listening on port ${port}`)
        console.log(`API Documentation: http://localhost:${port}`)
    })
}).catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
