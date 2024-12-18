import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './Utils/AppRoutes';
import ThemeProvider from './Components/Utiles/Theme/ThemeProvider';
import { LanguageProvider } from './Contexts/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <AppRoutes />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
