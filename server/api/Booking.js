const express = require('express');
const router = express.Router();
const Cook = require('./../models/Cook')
const nodemailer = require('nodemailer');
const Booking = require('./../models/Booking');

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

router.post('/create', async (req, res) => {
    try {
      const { cook_id, date, menuItems, totalPrice } = req.body;
        
      const newBooking = new Booking({
        user: req.session.user._id,
        cook: cook_id,
        date,
        menuItems: menuItems.map(item => item._id),
        totalPrice,
      });

      const mailOptionsUser = {
        from: process.env.AUTH_EMAIL,
        to: req.session.user.user_email,
        subject: "Booking Confirmation",
        html: `<p>Hello ${req.session.user.user_first_name}this is a receipt of your booking, it is at ${date} and the total price was ${totalPrice}</p>`,
    };

  
      await newBooking.save().then(() => {
        transporter.sendMail(mailOptionsUser).then(() => {
            res.json({
                status: "Pending",
                message: "Verification email sent",
            })
        }).catch((error) => {
            console.log(error);
            res.json({
                status: "Failed",
                message: "Verification email failed",

            })
        })
      });
  
      res.status(201).json({
        message: 'Booking created successfully',
        booking: newBooking,
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({
        message: 'Error creating booking',
        error,
      });
    }
  });
  

router.get('/cook/:cookId', async (req, res) => {
    const cookId = req.params.cookId;
  
    try {
      const bookings = await Booking.find({ cook: cookId });
      res.json({ status: 'SUCCESS', bookings });
    } catch (err) {
      console.error('Error fetching bookings for cook:', err);
      res.status(500).json({ status: 'FAILED', message: 'Error fetching bookings for cook' });
    }
  });

  router.get('/user', async (req, res) => {

    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userId = req.session.user._id;
  
    try {
      const bookings = await Booking.find({ user: userId });
      res.json({ status: 'SUCCESS', bookings });
    } catch (err) {
      console.error('Error fetching bookings for user:', err);
      res.status(500).json({ status: 'FAILED', message: 'Error fetching bookings for user' });
    }
  });

  router.get('/cook', async (req, res) => {
    if (!req.session.cook) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const cookId = req.session.cook._id;
  
    try {
      const bookings = await Booking.find({ cook: cookId });
      res.json({ status: 'SUCCESS', bookings });
    } catch (err) {
      console.error('Error fetching bookings for cook:', err);
      res.status(500).json({ status: 'FAILED', message: 'Error fetching bookings for cook' });
    }
  });
  

module.exports = router;