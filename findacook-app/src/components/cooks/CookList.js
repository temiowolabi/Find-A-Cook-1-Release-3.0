import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const CookList = () => {
  const [cooks, setCooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/cook/allcooks')
    .then((response) => {
      setCooks(response.data.cooks);
    })
    .catch((error) => {
      console.error('Error fetching cooks:', error);
    });
  }, []);

  return (
    <div>
      <h1>List of Cooks</h1>
      <ul>
        {cooks.map((cook) => (
          <li key={cook._id}>
            {cook.cook_first_name} - {cook.description}
            <img
            src= {`http://localhost:5001/${cook.profile_picture}`}
            alt=""
            />

            {console.log('Cook ID:', cook._id)}
            <Link to={`/cook-profile/${cook._id}`}>View</Link>
          </li>
        ))}
        </ul>
    </div>
  );
};

export default CookList;
  