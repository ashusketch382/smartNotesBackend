const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

connectDB();    
const app = express();
app.use(cors());    
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`))
