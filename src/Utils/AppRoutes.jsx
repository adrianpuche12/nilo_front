import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../Components/Auth/ProtectedRoutes';
import { AuthProvider } from '../Components/Auth/AuthContext';
import Layout from '../Components/Auth/Layout';
import AllUsers from '../Components/User/AllUsers';
import UserDetail from '../Components/User/UserDetail';
import Register from '../Components/Register';
import Home from '../Components/Home';
import Activities from '../Components/Activities/Activities';
import Province from '../Components/Province';
import Itineraries from '../Components/Itineraries/Itineraries';
import ItinerariesDetail from '../Components/Itineraries/ItinerariesDetail.js'
import Login from '../Components/Login';
import Cities from '../Components/cities';
import Countries from '../Components/Countries';
import UserProfile from '../Components/User/UserProfile'
import AdminHome from '../Components/Admin/AdminHome';
import UserReservations from '../Components/User/UserReservations';
import PromotionDetail from '../Components/Promotions/PromotionDetail';
import ActivityDetail from '../Components/Activities/ActivityDetailCard';
import AboutUs from '../Components/Pages/AboutUs'
import Contactos from '../Components/Pages/Contactos'
import CompanyPolicies from '../Components/Pages/CompanyPolicies';
import UserRegistration from '../Components/User/UserRegistration.js';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/user-registration' element={<UserRegistration/>} />      

        <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><Layout><UserDetail /></Layout></ProtectedRoute>} />
        <Route path="/countries" element={<ProtectedRoute><Layout><Countries /></Layout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Layout><AllUsers /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
        <Route path="/activities" element={<ProtectedRoute><Layout><Activities /></Layout></ProtectedRoute>} />
        <Route path="/province" element={<ProtectedRoute><Layout><Province /></Layout></ProtectedRoute>} />
        <Route path="/itineraries" element={<ProtectedRoute><Layout><Itineraries /></Layout></ProtectedRoute>} />
        <Route path="/itineraries/:id" element={<ProtectedRoute><Layout><ItinerariesDetail /></Layout></ProtectedRoute>} />
        <Route path="/promotions/:id" element={<ProtectedRoute><Layout><PromotionDetail /></Layout></ProtectedRoute>} />
        <Route path="/activities/:id" element={<ProtectedRoute><Layout><ActivityDetail /></Layout></ProtectedRoute>} />
        <Route path="/cities" element={<ProtectedRoute><Layout><Cities /></Layout></ProtectedRoute>} />
        <Route path="/admin/adminhome" element={<ProtectedRoute><Layout><AdminHome /></Layout></ProtectedRoute>} />
        <Route path="/userReservations" element={<ProtectedRoute><Layout><UserReservations /></Layout></ProtectedRoute>} />
        <Route path="/about-us" element={<ProtectedRoute><Layout><AboutUs /></Layout></ProtectedRoute>} />
        <Route path="/contactos" element={<ProtectedRoute><Layout><Contactos /></Layout></ProtectedRoute>} />
        <Route path="/politica" element={<ProtectedRoute><Layout><CompanyPolicies /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;