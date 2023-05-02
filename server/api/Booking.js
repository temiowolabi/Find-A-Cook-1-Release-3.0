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
    const { cook_id, date, menuItems, num_people } = req.body;

    const totalPrice = menuItems.reduce((total, item) => total + item.price, 0) * num_people;

    const newBooking = new Booking({
      user: req.session.user._id,
      cook: cook_id,
      date,
      num_people,
      menuItems: menuItems.map(item => item._id),
      totalPrice,
    });

    const mailOptionsUser = {
      from: process.env.AUTH_EMAIL,
      to: req.session.user.user_email,
      subject: "Booking Confirmation",
      html: `  <head>
      <meta charset="utf-8">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
          line-height: 1.5;
        }
        h1, h2, h3, h4, h5, h6 {
          font-weight: bold;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: #f7f7f7;
          padding: 20px;
        }
        .content {
          padding: 20px;
        }
        .footer {
          background-color: #f7f7f7;
          padding: 20px;
          text-align: center;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
          <p>Hello ${req.session.user.user_first_name},</p>
          <p>We are pleased to confirm your booking for the following:</p>
          <ul>
            <li>Date: ${date}</li>
            <li>Number of people: ${num_people}</li>
            <li>Menu items:</li>
            <ul>
              ${menuItems.map(item => `<li>${item.name}: ${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <li>Total Price: ${totalPrice.toFixed(2)}</li>
          </ul>
          <p>If you have any questions or concerns, please do not hesitate to contact us.</p>
          <p>Thank you for choosing our services.</p>
        </div>
        <div class="footer">
          <p>Copyright © 2023 Find A Cook.
            All rights reserved.</p>
        </div>
      </div>
    </body>`,
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