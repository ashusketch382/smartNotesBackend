const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

connectDB();    
const app = express();
app.use(cors());    
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server is running on port ${PORT}`))
