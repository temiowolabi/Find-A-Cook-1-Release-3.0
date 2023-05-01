import './App.css';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import CookLoginPage from './CookLoginPage';
import RegistrationPage from './RegistrationPage';
import TestPage from './TestPage';
import CartPage2 from './CartPage2';
import OrderInfoPage from './OrderInfoPage';
import ProductPage from './ProductPage';
import SampleAdminDashboard from './SampleAdminDashboard';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { commerce } from './lib/commerce';
import { useDispatch } from 'react-redux'
import { getCategories } from './redux/actions/categoryActions';
import Shipping from './Shipping';
import EditProduct from './components/Admin/EditProduct';
import Home from './Home';
import CookDashboard from './CookDashboard';
import TermsPage from './TermsPage';
import CookProfile from './CookProfile';
import FAQ from './FAQ';
import Contact from './Contact';


import VerificationPage from './VerificationPage';
import CookRegPage from './CookRegPage'
import CompleteForm from './CompleteForm';
import ApplicationSubmitted from './ApplicationSubmitted';
import TestApp from './TestApp';
import PaymentSuccessful from './PaymentSuccessful';
import PaymentUnsuccessful from './PaymentUnsucessful';
import AdminviewPage from './AdminViewPage';
import Area from './Area';
import SubscriptionPage from './SubscriptionPage'
import AdminCookListPage from './AdminCookListPage';
import CategoriesPage from './CategoriesPage';
import ViewBookingsPage from './ViewBookingsPage';
import BookingPage from './BookingPage';

import ReviewCook from './ReviewCook';
import JoaneMenu from './JoaneMenu';
import MauriceMenu from './MauriceMenu';
import JulianMenu from './JulianMenu';
import MortMenu from './MortMenu';
import AddMenu from './AddMenuItem';

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
      <Route path="/test" element={<TestPage/>} />
      <Route path="/cart" element={<CartPage2/>} />
      <Route path="/order" element={<OrderInfoPage/>} />
      <Route path="/edit/product/:productId" element={<EditProduct />} />
      <Route path="/product/:productId" element={<ProductPage/>} />
      <Route path="/admin" element={<SampleAdminDashboard/>} />
      <Route path="/shipping" element={<Shipping/>} />
      <Route path="/home" element={<Home />} />
      <Route path="/cookdashboard" element={<CookDashboard />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/profile" element={<CookProfile />} />
      <Route path="/verificationpage" element={<VerificationPage/>} />
      <Route path="/cooklogin" element={<CookLoginPage />} />
      <Route path="/cookregistration" element={<CookRegPage />} />
      <Route path="/complete-form" element={<CompleteForm />} />
      <Route path="/submit" element={<ApplicationSubmitted />} />
      <Route path="/testapp" element={<TestApp />} />
      <Route path="/area" element={<Area />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/paymentsuccessful" element={<PaymentSuccessful />} />
      <Route path="/paymentunsuccessful" element={<PaymentUnsuccessful />} />
      <Route path="/adminview" element={<AdminviewPage />} />
      <Route path="/cooklist" element={<AdminCookListPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/bookings" element={<ViewBookingsPage />} />
      <Route path="/cook" element={<BookingPage />} />
      <Route path="/cook/:cookId" element={<BookingPage/>} />
      {/* <Route path="/edit/category/:categoryId" element={<EditCategory />} />
      <Route path="/category/:categoryId" element={<CategoryPage/>} /> */}
      <Route path="/reviewcook" element={<ReviewCook />} />
      <Route path="/joanemenu" element={<JoaneMenu />} />
      <Route path="/mauricemenu" element={<MauriceMenu />} />
      <Route path="/julianmenu" element={<JulianMenu />} />
      <Route path="/mortmenu" element={<MortMenu />} />
      <Route path="/addmenu" element={<AddMenu />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contactus" element={<Contact />} />
  </Routes>
    </div>
  );
}

export default App;
