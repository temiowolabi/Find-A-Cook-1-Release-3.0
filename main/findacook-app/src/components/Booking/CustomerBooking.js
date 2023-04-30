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


const blockedDates = [
  new Date(2023, 4, 5), // May 5th, 2022
  new Date(2023, 5, 3), // June 3rd, 2022
  new Date(2023, 5, 15), // June 15th, 2022
  new Date(2023, 6, 21), // July 21st, 2022
  new Date(2023, 7, 10), // August 10th, 2022
];

function isDateBlocked(date) {
  return blockedDates.find((blockedDate) =>
    date.getFullYear() === blockedDate.getFullYear() &&
    date.getMonth() === blockedDate.getMonth() &&
    date.getDate() === blockedDate.getDate()
  );
}

const CustomerBooking = () => {
	const [slideNumber, setSlideNumber] = useState(0);
	const [open, setOpen] = useState(false);
	const [openModal, setOpenModal] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [date, setDate] = useState(new Date());
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  

    function handleSelectDate(date) {
      if (isDateBlocked(date)) {
        return;
      }
      setSelectedDate(date);
    }
  
    function tileDisabled({ date }) {
      return isDateBlocked(date);
    }

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
	const { cookId, bookingDate } = useParams();
	const dispatch = useDispatch(); 


	useEffect(() => {
		dispatch(getCook(cookId));
	}, [dispatch, cookId]);

	const handleClick = () => {

		  setOpenModal(true);

	  };

	const { cook } = useSelector(state => state.cooks);

  // const { roomid, bookingDate } = useParams();
  const theDate = moment(bookingDate, 'DD-MM-YYYY').format('DD-MM-YYYY');





  
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
<button className="bookNow" onClick={handleShow}>Book Now!</button>
 	  <div className="profile-picture">
 		{/* <img src={`/uploads/${cook.profile_picture}`} alt="Profile Picture" /> */}
    <img src="/images/cook1.jpg" />
 	  </div>
<h1 className="cookName">{cook.cook_first_name} {cook.cook_last_name}</h1>
 		<div className="credentials">
 			  <p className='verifiedTooltip'>Verified Cook <img src='/images/verified.png' className='verifiedImg'/><span className="tooltiptext">This cook is 100% verified by Find A Cook and meets our standards to ensure the highest quality experience for our clients.</span></p>
 			  <p className='verifiedTooltip'>Food Safety Cert <img src='/images/certification.png' className='verifiedImg'/><span className="tooltiptext">This cook maintains a certificate for food safety and sanitation to ensure ingredients, handling and preparation are in line with industry standards.</span></p> 
 			  <p><img src='/images/rating.jpg' id="rating-img"/>(67 reviews)</p>
 		  </div>
 		<p>{cook.description}</p>

     <ul>
        {cook.dishes && cook.dishes.map(dish => (
          <>
          <li key={dish._id}>{dish.dish}</li>
          <li key={dish._id}>  <img src={`/uploads/uploads/${dish.imageurls}`} alt="" /></li>
          </>
        ))}
      </ul>

		 <div className="cookFoodImages">
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
    
            </div>






			</div>


</div>

			)}
			{/* {openModal && <BookingForm setOpen={setOpenModal} cookId={cookId}/>} */}




			<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            {/* <Modal.Title>Select your menu items: </Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
        <div className='booking-app'>
      <h1 className='text-center'>Pick A Date</h1>
      <div className='calendar-container'>
        <Calendar         onChange={handleSelectDate}
        value={selectedDate}
        tileDisabled={tileDisabled} />
      </div>
      <p className='text-center'>
        <span className='bold'>Selected Date:</span>{' '}
        {date.toDateString()}
      </p>
    </div>
        </Modal.Body>
        <Modal.Footer>
            <button className='modalButton' onClick={handleClose}>
                Close
            </button>
        </Modal.Footer>
    </Modal>
  
</>
    );
  };
  
  export default CustomerBooking;
