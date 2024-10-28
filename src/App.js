import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllUsers from "./Components/User/AllUsers";
import UserDetail from './Components/User/UserDetail';
import Register from './Components/Register';
import Home from "./Components/Home";
import CountryDetail from "./Components/Country/CountryDetail ";
import Countries from "./Components/Country/Countries";
import CreateCountry from "./Components/Country/CreateCountry";

import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      < Outlet />

      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:id" element={<UserDetail />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<AllUsers />} />
          <Route path="/country-detail/:id" element={<CountryDetail />} />
          <Route path="/create-country" element={<CreateCountry />} />
        </Routes>
      </Router>

    </>
  );
}

export default App;
