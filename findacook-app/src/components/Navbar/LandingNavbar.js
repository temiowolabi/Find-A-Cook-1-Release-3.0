import { useState, useContext, useEffect } from 'react';
import '../CSS/Style.css'
import { useRef } from "react";
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
// import { CartContext } from '../../CartContext';
import { Modal } from "react-bootstrap";
// import DemoCart from '../Demo/DemoCart';
import { useSelector } from 'react-redux';

const LandingNavbar  = () => {
	// const cart = useContext(CartContext);

    const { cart } = useSelector(state => state.cart)
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

	// const productsCount = cart.items.reduce((sum, product) => sum + product.quantity, 0);

	const navRef = useRef();

	const showNavbar = () => {
		navRef.current.classList.toggle("responsive_nav");
	};

	// const checkout = async () => {
    //     await fetch('http://localhost:3001/checkout', {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({items: cart.items})
    //     }).then((response) => {
    //         return response.json();
    //     }).then((response) => {
    //         if(response.url) {
    //             window.location.assign(response.url); // Forwarding user to Stripe
    //         }
    //     });
	// }


    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginClick = () => {
      setShowLoginModal(true);
    };
  
    const handleModalClose = () => {
      setShowLoginModal(false);
    };
  
    const handleCookLoginClick = () => {
        navigate('/cooklogin')
      handleModalClose();
    };
  
    const handleCustomerLoginClick = () => {
        navigate('/login')
      handleModalClose();
    };

    // function handleNavigationClick(event) {
    //   event.preventDefault();
  
    //   const targetId = event.target.hash;
    //   const targetElement = document.querySelector(targetId);
  
    //   if (targetElement) {
    //     targetElement.scrollIntoView({ behavior: 'smooth' });
    //   } else if (window.location.pathname !== '/') {
    //     navigate(`/?scrollTo=${targetId}`);
    //   }
    // }

    // useEffect(() => {
    //   const targetId = window.location.hash;
    //   const targetElement = document.querySelector(targetId);
  
    //   if (targetElement) {
    //     targetElement.scrollIntoView({ behavior: 'smooth' });
    //   } else if (window.location.search === '?scrollTo=' + targetId) {
    //     const timeoutId = setTimeout(() => {
    //       const newTargetElement = document.querySelector(targetId);
    //       if (newTargetElement) {
    //         newTargetElement.scrollIntoView({ behavior: 'smooth' });
    //       }
    //     }, 500);

    //     return () => clearTimeout(timeoutId);
    //   }
    // }, []);

	return (
		<>


        <nav className='nav-bar'>
            <div className='nav-container'>
            <a href='/'>
            <img src="../images/logo-new-edit-01.png" className='navLogo'/>
            </a>
            <ul class="login-nav-links">
      <li><Link to={"/"}>Home</Link></li>
      <li><a href="#aboutSection">About Us</a></li>
      <li><a href="#serviceSection">Services</a></li>
      <li><Link to={"/faq"}>FAQ</Link></li>
      <li><Link to={"/contactus"}>Contact Us</Link></li>
      <li><button className="navbar-login-btn" onClick={handleLoginClick}>Log In</button></li>
    </ul>
            </div>

<Modal id='' show={showLoginModal} onHide={handleModalClose}>

        <Modal.Body>
        <div className="login-modal">
        <div className="login-modal-content">
        <h2>Log In</h2>
        <p>Are you a cook or a customer?</p>
            <button onClick={handleCookLoginClick}>Cook</button>
            <button onClick={handleCustomerLoginClick}>Customer</button>
            <button onClick={handleModalClose}>Cancel</button>
            </div>
            </div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
        </nav>

		{/* <header>
            <a href='/'>
            <img src="../images/logo-new-edit-01.png"/>
            </a>
     
			<nav ref={navRef}>

				<a href="/login">Sign In</a>
				<a href="/cooklogin">Sign In As A Cook</a>
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes /> 
				</button>
			</nav>
			<button className="nav-btn" onClick={showNavbar}>
				<FaBars />
			</button>
		</header> */}


	</>
	);
}

export default LandingNavbar