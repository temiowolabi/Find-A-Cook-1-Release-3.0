import React, { useState } from "react";
import LandingNavbar from './components/Navbar/LandingNavbar'
import Footer from './components/Footer/Footer';

const Contact = () => {
    const [activeIndex, setActiveIndex] = useState(null);
  
    const handleAccordionClick = (index) => {
      setActiveIndex(index === activeIndex ? null : index);
    };
  
    return (
      <>
        <LandingNavbar />

       

        <div className="contact-form-contrainer"> 
        <h3>Contact Us</h3>
        <form id="form" class="topBefore">
		
        <input id="name" type="text" placeholder="NAME" />
        <input id="email" type="text" placeholder="E-MAIL" />
        <textarea id="message" type="text" placeholder="MESSAGE"></textarea>
        <input id="submit" type="submit" value="GO!" />

        </form>
  
  </div>
        <Footer />
      </>
    );
  };
  

export default Contact;
