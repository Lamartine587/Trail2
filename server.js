const express = require('express');
require('dotenv').config();
const CONNECTDB = require('./config/db');
const path = require('path'); // Import the 'path' module

const userRoutes = require('./Routes/UserRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory (where server.js and register.html are)
app.use(express.static(__dirname));

// Route to serve the register.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Use your API routes
app.use('/users', userRoutes);

CONNECTDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});