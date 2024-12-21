import React from 'react';
import { useAuth } from '../Auth/AuthContext';
import AdminNavbar from '../Admin/AdminNavbar';
import UserNavBar from '../User/UserNavBar';

const Layout = ({ children }) => {
  const { roles } = useAuth();
  const isAdmin = roles.includes('admin');

  return (
    <>
      {isAdmin ? <AdminNavbar /> : <UserNavBar />}
      {children}
    </>
  );
};

export default Layout;