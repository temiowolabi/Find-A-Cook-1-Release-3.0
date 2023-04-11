const express = require('express');
const app = express();
// const stripe = require('stripe')('sk_test_51MYbfMDYuzoeBKxGcMhrNfA5j9wjsN4QqBDDofXq7ZXgfJhZB1K5R9MrUQZAEGVdzUgxgFcLyzSWIXLgbtUSD2Fz00NY3BBAUN');

// const connectDB = require('../database/db');
// const connectDB = require('../database/db');
const cors = require('cors');
const morgan = require('morgan');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const filterRoutes = require('./routes/filter');
// const subscriptionController = require('./routes/subscribe')
const mongoose = require('mongoose');
const path = require('path')
// Serve static files from the React frontend app
app.use('/static', express.static(path.join(__dirname, '../../main/findacook-app/build')))

// // Anything that doesn't match the above, send back index.html
// res.sendFile(path.join(__dirname, '../../main/findacook-app/build/index.html'))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,  '../main/findacook-app/build/index.html'));
  });

app.use(cors());
app.use(express.json());
app.use('/api/category', categoryRoutes);
// app.use('/api/subscribe', subscriptionController);
app.use('/api/product', productRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/filter', filterRoutes);



mongoose.set('strictQuery', false);

const connectDB = async () => {
    try{
        await mongoose.connect(
            'mongodb+srv://Team7:oXVVWGS8BCRZB2FM@findacook.dr9enwh.mongodb.net/?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        console.log('Database Connection Success');
    } catch (err) {
        console.log(err);
    }
};

connectDB();

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening on port ${port}`));
