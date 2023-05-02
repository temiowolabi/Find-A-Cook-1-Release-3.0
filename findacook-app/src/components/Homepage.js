import React, { useState, useEffect } from "react";
import axios from "axios";
import Cook from './CookDashboard/Cook'
import './CookDashboard/Cook.css'
import { DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';


const Homepage = () => {
  // Define state variables for the component
  const [cooks, setCooks] = useState([]); // array of cook objects
  const [bookingDate, setBookingDate] = useState(); // selected booking date
  const [searchValue, setSearchValue] = useState(''); // search input value
  const [filteredCooks, setFilteredCooks] = useState([]);

  const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   async function fetchCategories() {
  //     const response = await fetch('http://localhost:5001/cook/categories');
  //     const data = await response.json();
  //     setCategories(data.categories);
  //   }

  //   fetchCategories();
  // }, []);

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5001/cook/menucategories');
            if (response.data.status === 'SUCCESS') {
                setCategories(response.data.menuCategories);
            } else {
                alert('Error fetching menu categories');
            }
        } catch (error) {
            console.error('Error Fetching categories', error);
        }
      };
      fetchCategories();
  }, []);


  // Use an effect hook to fetch cooks data on component mount
  useEffect(() => {
    fetchCooks();
  }, []);

  // Async function to fetch cooks data from server
  const fetchCooks = async () => {
    try {
      const response = await axios.get("http://localhost:5001/cook/allcooks");
      setCooks(response.data.cooks); // set the state with the data
    } catch (error) {
      console.error("Error fetching cooks:", error);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      let response;
      if (searchValue === '') { // if search input is empty, fetch all cooks
        response = await axios.get("http://localhost:5001/cook");
      } else { // otherwise, search by cuisine or dish
        console.log("searchValue:", searchValue);
        const trimmedSearchValue = searchValue.trim(); // trim the search value
        response = await axios.post("http://localhost:5001/cook/searchcooks", {
          type: 'both',
          query: trimmedSearchValue
        });
      }
      setCooks(response.data.cooks); // set the state with the search result
    } catch (error) {
      console.error("Error searching for cooks:", error);
    }
  };
  
  
  const handleFilter = async (categoryName) => {
    try {
      const response = await axios.post('http://localhost:5001/cook/filtercooks', {
        category_name: categoryName,
      });
      setFilteredCooks(response.data.cooks);
    } catch (error) {
      console.error('Error filtering cooks', error);
    }
  };
  

  
  
  const handleClearSearch = async () => {
    setSearchValue('');
    setFilteredCooks([]);
    try {
      const response = await axios.get("http://localhost:5001/cook/allcooks");
      setCooks(response.data.cooks); // set the state with all the cooks
    } catch (error) {
      console.error("Error fetching cooks:", error);
    }
  };

  // Function to handle the booking date selection
  const filterByDate = (dates) => {
    const date = dates.format('DD-MM-YYYY');
    setBookingDate(date); // set the state with the selected date
  };

  return (
    <>
      <div>
        <nav className="">
          {/* <DatePicker format={'DD-MM-YYYY'} onChange={filterByDate} /> */}
          <form className="search-container" onSubmit={handleSearch}>
            <input
              id="search"
              type="search"
              placeholder="Search by cuisine or dish..."
              name="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <button
              className=""
              type="submit"
              disabled={!searchValue}
            >
              Search
            </button>
            <button
              className="clearSearch"
              type="button"
              onClick={handleClearSearch}
              // disabled={searchValue === ''}
            >
              Clear Search
            </button>
          </form>
        </nav>
      </div>
  
      <div className="filter-section">
  <h3>Filter by Cuisine:</h3>
  <ul>
          {categories &&
            categories.map((category) => (
              <div className="filter-card" key={category.id} onClick={() => handleFilter(category.category_name)}>
                <li>{category.category_name}</li>
              </div>
            ))}
        </ul>
</div>

<div className="restaurant-list">
{(filteredCooks.length > 0 ? filteredCooks : cooks).map((cook, index) => (

  <div className="restaurant" key={cook._id}>
      <div class="restaurant-images">
    <img src="../images/gnocchi.jpg" alt="Restaurant Image" className='restaurant-food-image' />
    <img src="../images/cook1.jpg" alt="User Profile Picture" className="restaurant-profile-image" />
  </div>

    <div className="restaurant-details">
    <Link to={`/cook/${cook._id}`}>
    <h2 className="restaurant-name">{cook.cook_first_name}</h2>
        </Link>
      <p className="cuisine-type">{cook.specialties}</p>
      <p className="rating">⭐ {Math.floor(Math.random() * 5) + 1} / 5 ({Math.floor(Math.random() * 100)})</p>
    </div>
  </div>
))} 
   

{/* {cooks.map((cook, index) => (
  <div className="restaurant" key={cook._id}>
      <div class="restaurant-images">
    <img src="../images/gnocchi.jpg" alt="Restaurant Image" className='restaurant-food-image' />
    <img src="../images/cook1.jpg" alt="User Profile Picture" className="restaurant-profile-image" />
  </div>

    <div className="restaurant-details">
      <h2 className="restaurant-name">{cook.cook_first_name}</h2>
      <p className="cuisine-type">{cook.specialties}</p>
      <p className="rating">⭐ {Math.floor(Math.random() * 5) + 1} / 5 ({Math.floor(Math.random() * 100)})</p>
    </div>
  </div>
))} */}

</div>
    </>
  );
};

export default Homepage;