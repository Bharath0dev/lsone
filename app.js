const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const app=express();

require('./config/db.js');

const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const serviceRoutes = require('./routes/serviceRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes'); 
const availabilityRoutes = require('./routes/availabilityRoutes.js');
const reviewRoutes = require('./routes/reviewsRoutes');
const notificationRoutes = require('./routes/NotificationRoutes.js');

app.use(express.json());
app.use(cors());

app.use('/', authRoutes); 
app.use('/', userRoutes); 
app.use('/', serviceRoutes); 
app.use('/', bookingRoutes); 
app.use('/', availabilityRoutes); 
app.use('/', reviewRoutes);
app.use('/', notificationRoutes);


app.get('/', (req, res)=>{
    res.send({status:'started'})
})

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(4021, ()=>{
    console.log('Server is running')
})
