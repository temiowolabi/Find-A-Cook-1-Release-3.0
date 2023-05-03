import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);

  axios.defaults.withCredentials = true
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5001/booking/user');
        setBookings(response.data.bookings);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };

    fetchUserBookings();
  }, []);

  return (
    <div>
      <Topbar />
      <Sidebar />
      <h1>Your Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id}>
            <h3>{booking.cook_id.cook_first_name} {booking.cook_id.cook_last_name}</h3>
            <p>Date: {new Date(booking.date).toLocaleString()}</p>
            <p>Total Price: ${booking.totalPrice.toFixed(2)}</p>
            <h4>Menu Items:</h4>
            <ul>
              {booking.menuItems.map((item) => (
                <li key={item._id}>{item.dish} - ${item.price.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerBookings;
