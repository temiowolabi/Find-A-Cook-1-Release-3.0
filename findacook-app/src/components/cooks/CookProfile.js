import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CookProfile = () => {
  const [cook, setCook] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [cart, setCart] = useState([]);
  const { cookId } = useParams();

  useEffect(() => {
    const fetchCookAndBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/cook/cook/${cookId}`);
        const bookingResponse = await axios.get(`http://localhost:5001/booking/cook/${cookId}`);
        const menuResponse = await axios.get(`http://localhost:5001/cook/menu/cook/${cookId}`);
        setMenuItems(menuResponse.data.menuItems);
        console.log('Response data:', response.data);
        
        setCook(response.data.cook);
        setBookings(bookingResponse.data.bookings);
      } catch (error) {
        console.error('Error fetching cook data for cook ID:', cookId, 'Error:', error);
      }
    };

    fetchCookAndBookings();
  }, [cookId]);

  const bookedDates = bookings.map(booking => new Date(booking.date));

  const handleBooking = async () => {
    try {
        await axios.post('http://localhost:5001/booking/create', {
            cook_id: cook,
            date: selectedDate,
            menuItems: cart,
            totalPrice: cart.reduce((total, item) => total + item.price, 0),
        });
        setBookings([...bookings, {date: selectedDate }]);
        alert('Booking created successfully');
    } catch (error) {
        console.error('Error creating booking:', error);
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  if (!cook) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        Test
      <h1>{cook.cook_first_name} {cook.cook_last_name}</h1>
      <p>{cook.description}</p>
      <p>{cook.cook_bio}</p>
      <img src={cook.profile_picture} alt={`${cook.cook_first_name}'s profile`} />
      
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        excludeDates={bookedDates}
        showTimeSelect
        dateFormat="Pp"
      />

      <button onClick={handleBooking}>Book</button>

      <h2>Menu Items</h2>
      {menuItems.map((menuItem) => (
        <div key={menuItem._id}>
          <h3>{menuItem.dish}</h3>
          <p>{menuItem.dish_description}</p>
          <p>${menuItem.price.toFixed(2)}</p>
          <button onClick={() => addToCart(menuItem)}>Add to Booking</button>
        </div>
      ))}

      <div>
        <h2>Cart</h2>
        {cart.map((item) => (
          <div key={item._id}>
            <h3>{item.dish}</h3>
            <p>${item.price.toFixed(2)}</p>
          </div>
        ))}
                <h3>
          Total Price: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
        </h3>
      </div>
    </div>
  );
};

export default CookProfile;
