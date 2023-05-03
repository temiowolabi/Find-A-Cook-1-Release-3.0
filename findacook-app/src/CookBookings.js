import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';

const CookBookings = () => {
  const [bookings, setBookings] = useState([]);

  axios.defaults.withCredentials = true
  useEffect(() => {
    const fetchCookBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5001/booking/cook');
        setBookings(response.data.bookings);
      } catch (error) {
        console.error('Error fetching cook bookings:', error);
      }
    };

    fetchCookBookings();
  }, []);

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div style={{marginLeft: '260px'}}>
      <h1>Bookings for Your Services</h1>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id}>
            <h3>{booking.user.user_first_name} {booking.user.user_last_name}</h3>
            <p>Date: {new Date(booking.date).toLocaleString()}</p>
            <p>Total Price: ${booking.totalPrice.toFixed(2)}</p>
          </div>
          
        ))
      )}
      </div>
    </div>
  );
};

export default CookBookings;
