// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const authController = require('./controllers/authController');
const enquiryController = require('./controllers/enquiryController');
const authenticateToken = require('./middleware/authenticateToken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Register and login routes
app.post('/register', authController.register);
app.post('/login', authController.login);

// Public form route
app.post('/enquiry', enquiryController.submitEnquiry);

// Protected routes
app.post('/claim-lead/:leadId', authenticateToken, enquiryController.claimLead);
app.get('/unclaimed-leads', authenticateToken, enquiryController.getUnclaimedLeads);
app.get('/claimed-leads', authenticateToken, enquiryController.getClaimedLeads);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
