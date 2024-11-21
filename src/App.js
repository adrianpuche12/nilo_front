import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Utils/AppRoutes';
import  ThemeProvider  from './Components/Utiles/Theme/ThemeProvider'; 

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
