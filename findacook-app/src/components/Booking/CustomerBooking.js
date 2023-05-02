import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCook } from '../../redux/actions/cookActions'
import { BsArrowDownLeft } from 'react-icons/bs';
import { BsArrowDownRight } from 'react-icons/bs';
import { FaWindowClose } from 'react-icons/fa'
import { Modal, Button } from "react-bootstrap";
import BookingForm from './BookingForm';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';




const CustomerBooking = () => {
	const [slideNumber, setSlideNumber] = useState(0);
	const [open, setOpen] = useState(false);
	const [openModal, setOpenModal] = useState(false);
  const [show, setShow] = useState(false);
 
  const [cook, setCook] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [cart, setCart] = useState([]);
  const { cookId } = useParams();
  const [numPeople, setNumPeople] = useState(1);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

	const handleOpen = (i) => {
		setSlideNumber(i);
		setOpen(true);
	  };
	
	  const handleMove = (direction) => {
		let newSlideNumber;
	
		if (direction === "l") {
		  newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
		} else {
		  newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
		}
	
		setSlideNumber(newSlideNumber);
	  };

	  
  const navigate = useNavigate();
	const dispatch = useDispatch(); 


	const handleClick = () => {

		  setOpenModal(true);

	  };

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
              num_people: numPeople,
              totalPrice: cart.reduce((total, item) => total + item.price, 0) ,
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
    const removeFromCart = (itemToRemove) => {
      setCart(cart.filter((item) => item._id !== itemToRemove._id));
    };
    
    
  
    if (!cook) {
      return <div>Loading...</div>;
    }


  
    return (
<>


{cook && (

<div className='cookContainer'>
{open && (
            <div className="slider">
              <FaWindowClose
                className="close"
                onClick={() => setOpen(false)}
              />
              <BsArrowDownLeft
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <img
                  src='../images/bao.jpg'
                  alt=""
                  className="sliderImg"
                />

              </div>
              <BsArrowDownRight
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}

<div className="cookWrapper">
<DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        excludeDates={bookedDates}
        showTimeSelect
        dateFormat="Pp"
        placeholderText={'Please select a date'} 
      />
      
      <div class="stepper">
        <p className=''>For How Many?<span className="tooltiptext2">How many people are you booking for?</span></p>
  <input type="button" value="-" class="stepper-btn minus" onClick={() => setNumPeople(Math.max(numPeople - 1, 0))} />
  <input
    type="number"
    id="numPeople"
    name="numPeople"
    className='numberPeople'
    placeholder=' '
    value={numPeople}
    max={10}
    onChange={(e) => setNumPeople(e.target.value)}
  />
  <input type="button" value="+" class="stepper-btn plus" onClick={() => setNumPeople(Math.min(numPeople + 1, 10))} />
</div>



      <button onClick={handleBooking} className='bookNow'>Book</button>
      
 	  <div className="profile-picture">
     <img src={cook.profile_picture} alt={`${cook.cook_first_name}'s profile`} />
 	  </div>
<h1 className="cookName">{cook.cook_first_name} {cook.cook_last_name}</h1>
 		<div className="credentials">
 			  <p className='verifiedTooltip'>Verified Cook <img src='/images/verified.png' className='verifiedImg'/><span className="tooltiptext">This cook is 100% verified by Find A Cook and meets our standards to ensure the highest quality experience for our clients.</span></p>
 			  <p className='verifiedTooltip'>Food Safety Cert <img src='/images/certification.png' className='verifiedImg'/><span className="tooltiptext">This cook maintains a certificate for food safety and sanitation to ensure ingredients, handling and preparation are in line with industry standards.</span></p> 
 			  <p><img src='/images/rating.jpg' id="rating-img"/>(67 reviews)</p>
 		  </div>
 		<p>{cook.description}</p>

     {/* <ul>
        {cook.dishes && cook.dishes.map(dish => (
          <>
          <li key={dish._id}>{dish.dish}</li>
          <li key={dish._id}>  <img src={`/uploads/uploads/${dish.imageurls}`} alt="" /></li>
          </>
        ))}
      </ul> */}

      <hr />

      {/* <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        excludeDates={bookedDates}
        showTimeSelect
        dateFormat="Pp"
      />

      <button onClick={handleBooking} className='bookNow'>Book</button> */}
      <div class="menu-container">

  <div class="menu-items">
    <h2>Menu Items</h2>
    {menuItems.map((menuItem) => (
      <div class="menu-item" key={menuItem._id}>
        <h3>{menuItem.dish}</h3>
        <p>{menuItem.dish_description}</p>
        <p>€{menuItem.price.toFixed(2)}</p>
        <button className="accept-btn" onClick={() => addToCart(menuItem)}>Add</button>
        <button className="decline-btn" onClick={() => removeFromCart(menuItem)}>Remove</button>
      </div>
    ))}
  </div>
  <div class="cart">
  <h2 class="cart-title">Your Booking</h2>
  {cart.map((item) => (
    <div class="cart-item" key={item._id}>
      <span class="cart-item-name">{item.dish}</span>
      <span class="cart-item-price">€{item.price.toFixed(2)}</span>
    </div>
  ))}
  <div class="cart-total">
    <span class="cart-total-label">Price Per Person:</span>
    <span class="cart-total-price">€{cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</span>
  </div>

  <hr />
  <div class="cart-total">
    <span class="cart-total-label">Total:</span>
    <span class="cart-total-price">€{cart.reduce((total, item) => total + item.price, 0).toFixed(2) * numPeople}</span>
  </div>
</div>
</div>



		 {/* <div className="cookFoodImages">
                <div className="cookFoodImgWrapper" >
                  <img
                    // onClick={() => setOpen(true)}
                    src='/images/sushi.jpg'
                    alt=""
                    className="cookFoodlImg"
                  />
				  
                </div>
				<div className="cookFoodImgWrapper" >
                  <img
                    // onClick={() => handleOpen(i)}
                    src='/images/ramen.jpg'
                    alt=""
                    className="cookFoodlImg"
                  />
				  
                </div>
				<div className="cookFoodImgWrapper" >
                  <img
                    // onClick={() => handleOpen(i)}
                    src='/images/rice.jpg'
                    alt=""
                    className="cookFoodlImg"
                  />
				  
                </div>
				<div className="cookFoodImgWrapper" >
                  <img
                    // onClick={() => handleOpen(i)}
                    src='/images/udon.jpg'
                    alt=""
                    className="cookFoodlImg"
                  />
				  
                </div>
				<div className="cookFoodImgWrapper" >
                  <img
                    // onClick={() => handleOpen(i)}
                    src='/images/chicken.jpg'
                    alt=""
                    className="cookFoodlImg"
                  />
				  
                </div>

				<div className="cookFoodImgWrapper" >
                  <img
                    // onClick={() => handleOpen(i)}
                    src='/images/katsu.jpg'
                    alt=""
                    className="cookFoodlImg"
                  />
				  
                </div>
    
            </div> */}






			</div>


</div>

			)}
			{/* {openModal && <BookingForm setOpen={setOpenModal} cookId={cookId}/>} */}




			<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            {/* <Modal.Title>Select your menu items: </Modal.Title> */}
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
    </Modal>
  
</>
    );
  };
  
  export default CustomerBooking;
