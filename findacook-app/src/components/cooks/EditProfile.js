import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Redirect } from "react-router-dom";


const EditProfileForm = () => {
  const [formData, setFormData] = useState({
    cook_first_name: '',
    cook_last_name: '',
    description: '',
  });
  const [image, setImage] = useState(null)

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('cook_first_name', formData.cook_first_name);
    formDataToSend.append('cook_last_name', formData.cook_last_name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('profile_picture', image);

    
    axios.put('http://localhost:5001/cook/editprofile', formDataToSend)
    .then((response) => {
      console.log("response received", response.data);
      setMessage(response.data.message);
      navigate("/cookdashboard")
    })
    .catch((error) => {
      console.log("error received", error.response.data);
      setMessage(error.response.data);
    })
  }

  return (
    <form className= "EditForm"onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px', marginLeft: '250px'}}>
      
        First Name:
        <input
          type="text"
          name="cook_first_name"
          value={formData.cook_first_name}
          onChange={handleChange}
        />
      
      
        Last Name:
        <input
          type="text"
          name="cook_last_name"
          value={formData.cook_last_name}
          onChange={handleChange}
        />
      
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      
        Profile Picture:
        <input type="file" name="profile_picture" onChange={handleFileChange} />
      
      <button type="submit">Submit</button>
      {message}
    </form>
    
  );
};

export default EditProfileForm;
