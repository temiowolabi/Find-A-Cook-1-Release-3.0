import React, { useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "./components/BackButton";
import { BsTwitter } from 'react-icons/bs';
import { FaFacebook } from 'react-icons/fa';
import { FaGoogle } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import "./index.css";
import axios from "axios";

function CookRegPage() {
  const [cook, setCook] = useState({
    cook_first_name: "",
    cook_last_name: "",
    cook_email: "",
    cook_password: "",
    cook_birthday: ""
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCook({ ...cook, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5001/cook/cooksignup', cook)
    .then((response) => {
      console.log("response received", response.data);
      setMessage(response.data.message);
    })
    .catch((error) => {
      console.log("error received", error.response.data);
      setMessage(error.response.data);
    });
    
  };
  return (
    <>

<div className="login-fg">
    <div className="container-fluid">
        <div className="row">
        <div className="col-xl-8 col-lg-7 col-md-12 bg" style={{backgroundImage: "url('./images/cookReg.png')"}}>
            </div>
            <div className="col-xl-4 col-lg-5 col-md-12 login">
                <div className="login-section">
                    <div className="logo clearfix">
                        <a href="#">
                            Find A Cook
                        </a>
                    </div>
                    <h3>New Here? Join Us!</h3>
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group form-fg">
                                <input type="email" name="email" className="input-text" value={cook.cook_email} onChange={handleInputChange} placeholder="Email Address" />
                            </div>
                            <div className="form-group form-fg">
                                <input type="text" name="firstName" className="input-text" value={cook.cook_first_name} onChange={handleInputChange} placeholder="Legal First Name" />
                            </div>
                            <div className="form-group form-fg">
                                <input type="text" name="surname" className="input-text" value={cook.cook_last_name} onChange={handleInputChange} placeholder="Legal Surname" />
                            </div>
                            <div className="form-group form-fg">
                            <input type="password" name="cook_password" className="input-text" value={cook.cook_password} onChange={handleInputChange} placeholder="Password" />
                            </div>
                            {/* <div className="form-group form-fg">
                                <input type="email" name="email" className="input-text" onChange={handleInputChange} placeholder="Confirm Password" />
                            </div> */}
                            <div className="form-group form-fg">
                                <input type="date" name="date" className="input-text" value={cook.cook_birthday} onChange={handleInputChange} placeholder="Birth Date" />
                            </div>
                            <div className="form-group mt-2">
                                <button type="submit" className="btn-md btn-fg btn-block">Continue</button>
                                
                            </div>
                        </form>
                        {message}
                    </div>
                    <p>Already one of us? <a href="/cooklogin" className="linkButton">Sign In</a></p>
                    <p>Or <a href='/'>Go Back to Homepage</a></p>
                </div>
            </div>
        </div>
    </div>
</div>  


    </>
  );
}

export default CookRegPage;
