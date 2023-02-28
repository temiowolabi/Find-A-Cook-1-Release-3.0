
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
import SampleAdminDashboard from './SampleAdminDashboard';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { commerce } from './lib/commerce';
import EditProduct from './components/Admin/EditProduct';
import { useDispatch } from 'react-redux'
import { getCategories } from './redux/actions/categoryActions';

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
      <Route path="/product" element={<ProductPage/>} />
      <Route path="/documentupload" element={<UploadDocuments/>} />
      <Route path="/edit/product/:productId" element={<EditProduct />} />

    
  </Routes>
    </div>
  );
}

export default App;
