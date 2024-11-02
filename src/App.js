import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { Outlet } from "react-router-dom";
import AppRoutes from './Utils/AppRoutes';

function App() {
  return (
    <>
      <Outlet />
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;