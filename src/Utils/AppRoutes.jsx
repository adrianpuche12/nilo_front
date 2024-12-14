import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../Components/Auth/ProtectedRoutes';
import { AuthProvider } from '../Components/Auth/AuthContext';
import AllUsers from '../Components/User/AllUsers';
import UserDetail from '../Components/User/UserDetail';
import Register from '../Components/Register';
import Home from '../Components/Home';
//import CountryDetail from '../Components/Country/CountryDetail ';
//import Countries from '../Components/Country/Countries';
//import CreateCountry from '../Components/Country/CreateCountry';
import Activities from '../Components/Activities/Activities';
import Province from '../Components/Province';
import Itineraries from '../Components/Itineraries/Itineraries';
import ItinerariesDetail from '../Components/Itineraries/ItinerariesDetail.js'
import Login from '../Components/Login';
import Cities from '../Components/cities';
import Countries from '../Components/Countries';
import UserProfile from '../Components/User/UserProfile'
//import TripCities from '../Components/TripCities';
import AdminHome from '../Components/Admin/AdminHome'; 
import AdminNavbar from '../Components/Admin/AdminNavbar';
import UserReservations from '../Components/User/UserReservations';
import PromotionDetail from '../Components/Promotions/PromotionDetail';
import ActivityDetail from '../Components/Activities/ActivityDetailCard';
import AboutUs from '../Components/Pages/AboutUs'
import Contactos from '../Components/Pages/Contactos'
import CompanyPolicies from '../Components/Pages/CompanyPolicies';


const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
        <Route path="/countries" element={<ProtectedRoute><Countries /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><AllUsers /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        {/*{<Route path="/country-detail/:id" element={<ProtectedRoute><CountryDetail /></ProtectedRoute>} />}
        <Route path="/create-country" element={<ProtectedRoute><CreateCountry /></ProtectedRoute>} /> */}
        <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
        <Route path="/province" element={<ProtectedRoute><Province /></ProtectedRoute>} />
        <Route path="/itineraries" element={<ProtectedRoute><Itineraries /></ProtectedRoute>} />
        <Route path="/itineraries/:id" element={<ProtectedRoute><ItinerariesDetail /></ProtectedRoute>} />
        <Route path="/promotions/:id" element={<ProtectedRoute><PromotionDetail /></ProtectedRoute>} />
        <Route path="/Activities/:id" element={<ProtectedRoute><ActivityDetail /></ProtectedRoute>} />
        <Route path="/cities" element={<ProtectedRoute><Cities /></ProtectedRoute>} />
        {/*<Route path="/trip-cities" element={<ProtectedRoute><TripCities /></ProtectedRoute>} />*/}   
        <Route path="/admin/adminhome" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
        <Route path="/admin/adminnav" element={<ProtectedRoute><AdminNavbar /></ProtectedRoute>} />
        <Route path="/userReservations" element={<ProtectedRoute><UserReservations /></ProtectedRoute>} />
        <Route path="/about-us" element={<ProtectedRoute><AboutUs/></ProtectedRoute>} />
        <Route path="/contactos" element={<ProtectedRoute><Contactos/></ProtectedRoute>} />
        <Route path="/politica" element={<ProtectedRoute><CompanyPolicies /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;