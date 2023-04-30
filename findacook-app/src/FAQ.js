import React, { useState } from "react";
import LandingNavbar from './components/Navbar/LandingNavbar'
import Footer from './components/Footer/Footer';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);
  
    const handleAccordionClick = (index) => {
      setActiveIndex(index === activeIndex ? null : index);
    };
  
    return (
      <>
        <LandingNavbar />
        <h1 className="faqH1">Frequently Asked Questions</h1>
  
        <div className="accordion">
          <div className={`accordion-item ${activeIndex === 0 ? 'active' : ''}`} onClick={() => handleAccordionClick(0)}>
            <h2 className="accordion-header">Special Requests</h2>
            <div className="accordion-content">
            <h3>CAN I SUBSTITUTE OR CHANGE THE MENU?</h3>
      <p>Cooks can accommodate most dietary restrictions upon request. When booking your experience, our site will prompt you to note dietary restrictions or special preferences.</p>

      <h3>WHAT IF I NEED A DIFFERENT TIME?</h3>
      <p>Cooks may be available to modify the start time upon request. If you would like to change the start time by less than 2 hours, book online for the time listed and note your preferred time in your message to the cook. The cook will adjust the start time as part of accepting your request. Alternatively, if you would like to adjust the start time by more than 2 hours, submit a date request for the time you prefer.</p>
   
      <h3>HOW MANY PEOPLE CAN ATTEND?</h3>
<p>Our cooks are happy to accommodate various group sizes. Our site allows you to search your area by using our group size filter.</p>
            </div>
          </div>
  
          <div className={`accordion-item ${activeIndex === 1 ? 'active' : ''}`} onClick={() => handleAccordionClick(1)}>
            <h2 className="accordion-header">Trouble Booking</h2>
            <div className="accordion-content">
            <h3>I CANNOT FIND AN AVAILABLE COOK FOR MY DATE</h3>

            <p>Please submit a date request for the cook of your choice, or search a broader date range if you can be flexible on the date for your experience. Alternatively, email admin@findacook.com for assistance.</p>

            <h3>ADD OR CHANGE AN ADDRESS TO YOUR BOOKING</h3>

            <p>Please submit any changes to your booking to your cook directly by using the email address or phone number provided to you during your booking.</p>

            <h3>BOOKED FOR WRONG DATE OR WRONG PARTY SIZE</h3>

            <p>Please submit any changes to your booking to your cook directly by using the email address or phone number provided to you during your booking.

</p>

            <h3>FIND MORE INFORMATION AT MY BOOKINGS
</h3>

            <p>To view the status of your booking, log in to www.findacook.com, go to “My Bookings” and then “See Details.” You will be able to access the details pertaining to your booking.</p>
            </div>
          </div>
  
          <div className={`accordion-item ${activeIndex === 2 ? 'active' : ''}`} onClick={() => handleAccordionClick(2)}>
            <h2 className="accordion-header">Changing or Cancelling a Booking</h2>
            <div className="accordion-content">

                <h3>WHAT IF I NEED TO CANCEL?</h3>
            <p>We completely understand when things come up last minute. You can cancel up to 48 hours before an event without any fee. If you cancel less than 48 hours before an experience, you will be billed for the full amount.</p>
      <p>Cooks buy ingredients fresh from the market and specialty stores and spend hours preparing for your special event. We have this cancellation policy in place in order to honor their time and ingredient purchases.</p>
      <p>You may change the date or time of your event by contacting your cook directly via email Or, if you need to cancel, email admin@FindACook.com.</p>


      <h3>HOW CAN I ADD MORE GUESTS TO MY RESERVATION?</h3>
      <p>Log into your account, navigate to “My Bookings,” click the green “Details” button, click the green “Book more spots” and follow the prompts to add more guests to your reservation.</p>


      <h3>HOW DO I MAKE A CHANGE TO MY RESERVATION?</h3>
      <p>Find A Cook allows you to update your reservation up to 48 hours before the event is scheduled to start. To change the date or time of your event, contact your cook directly by sending a message through “My Messages.” To increase or decrease your group size, email sales@FindACook.com.</p>


      <h3>WHAT DO I DO IF I HAVE NOT RECEIVED ANY CONFIRMATION?</h3>

      <p>Upon submitting your request online, a notice confirming the reservation request is sent to the email address on record for you. You can check that the email address on record is correct under “My Profile” in your Find A Cook account. If the email on record is correct, check your promotions or spam filter within your email account to locate your confirmation notice.</p>
            </div>
          </div>
  

        </div>
  
        <Footer />
      </>
    );
  };
  

export default FAQ;
