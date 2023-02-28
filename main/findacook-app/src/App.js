
import './App.css';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import UploadDocuments from './UploadDocuments';
import RegistrationPage from './RegistrationPage';
import GuestPage from './GuestPage';
import TestPage from './TestPage';
import CartPage2 from './CartPage2';
import OrderInfoPage from './OrderInfoPage';
import ProductPage from './ProductPage';
<<<<<<< HEAD
import SampleAdminDashboard from './SampleAdminDashboard';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { commerce } from './lib/commerce';
=======
import Shipping from './Shipping';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { commerce } from './lib/commerce';
import SampleAdminDashboard from './SampleAdminDashboard';
import EditProduct from './components/Admin/EditProduct';
import { useDispatch } from 'react-redux'
import { getCategories } from './redux/actions/categoryActions';
import Home from './Home';
>>>>>>> sprint11-css-changes

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
          dispatch(getCategories());
  }, [dispatch]);

  return (
    <div>
          <Routes>
      
      <Route exact path="/" element={<LandingPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegistrationPage/>} />
      <Route path="/guest" element={<GuestPage/>} />
      <Route path="/test" element={<TestPage/>} />
      <Route path="/cart" element={<CartPage2/>} />
      <Route path="/order" element={<OrderInfoPage/>} />
<<<<<<< HEAD
      <Route path="/product" element={<ProductPage/>} />
      <Route path="/documentupload" element={<UploadDocuments/>} />
      <Route path="/admin" element={<SampleAdminDashboard/>} />
=======
      <Route path="/product/:productId" element={<ProductPage/>} />
      <Route path="/admin" element={<SampleAdminDashboard/>} />
      <Route path="/documentupload" element={<UploadDocuments/>} />
      <Route path="/shipping" element={<Shipping/>} />
      <Route path="/edit/product/:productId" element={<EditProduct />} />
      <Route path="/home" element={<Home />} />
>>>>>>> sprint11-css-changes
    
  </Routes>
    </div>
  );
}

export default App;
