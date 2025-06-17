import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import styles from './Header.module.css';
import cultureLogo from '../assets/culture-logo.png';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('customerToken') !== null || localStorage.getItem('adminToken') !== null;
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setIsLoggedIn(false);
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    if (localStorage.getItem('adminToken')) {
      navigate('/admin/dashboard');
    } else {
      navigate('/profile');
    }
  };

  return (
    <header className="w-full">
      {/* Top Banner */}
      <div className={styles.top_banner}>
        <div className={styles['culture-container']}>
          <span className="flex-shrink-0">Book your slot at nearest location - 30% OFF using SAVE30</span>
          <span className="flex-shrink-0">Book 1st Slot and Get Coupon for 2nd Slot</span>
          <span className="flex-shrink-0">Book your slot at nearest location - 30% OFF using SAVE30</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className='container'>
      <nav className={`bg-white py-4 px-6 flex justify-between items-center ${styles.nav_container}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={cultureLogo} alt="Sports Culture Logo" className="h-8" />
        </Link>

        {/* Navigation Links */}
        <div className={styles['nav_menu_container']}>
          <Link to="/" className="hover:text-[#6a1b9a]">Home</Link>
          <Link to="/about" className="hover:text-[#6a1b9a]">About us</Link>
          <Link to="/courts" className="hover:text-[#6a1b9a]">Courts</Link>
          <Link to="/games" className="hover:text-[#6a1b9a]">Games</Link>
          <Link to="/volunteer" className="hover:text-[#6a1b9a]">Volunteer</Link>
          <Link to="/blogs" className="hover:text-[#6a1b9a]">Blogs</Link>
          <Link to="/contact" className="hover:text-[#6a1b9a]">Contact</Link>
        </div>

        {/* Right Section: Location and Login */}
        <div className="d-flex align-items-center gap-3">
          <select className="bg-gray-100 p-2 rounded-md border-0 text-gray-700 text-sm">
            <option>Ahmadabad</option>
            {/* Add more locations as needed */}
          </select>
          
          {isLoggedIn ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="primary"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="bg-[#fff] border-[#F1A501] border-1 text-[#000] px-5 py-2 rounded-[40px] md:block font-semibold text-base">
                Login
              </Link>
              {/* <Link to="/signup" className="bg-[#6a1b9a] text-white px-5 py-2 rounded-md hover:bg-purple-800 md:block font-semibold text-base">
                Sign Up
              </Link>
              <Link to="/admin/login" className="text-[#6a1b9a] hover:text-purple-800 md:block font-semibold text-base">
                Admin Login
              </Link> */}
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700 focus:outline-none">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>
      </div>
    </header>
  );
};

export default Header; 