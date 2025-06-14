import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Header from './components/Header';
import Home from './pages/Home';
import Sports from './pages/Sports';
import Culture from './pages/Culture';
import About from './pages/About';
import HeroBanner from './components/HeroBanner';
import SearchResults from './components/SearchResults';
import TurfList from './pages/TurfList';
import VenueListing from './pages/VenueListing';
import VenueDetail from './pages/VenueDetail';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import CustomerLogin from './pages/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Router>
          <Header />
          <div className="container mx-auto px-4 mt-4 mb-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sports" element={<Sports />} />
              <Route path="/culture" element={<Culture />} />
              <Route path="/about" element={<About />} />
              <Route path="/turf-booking" element={<HeroBanner />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/turfs" element={<TurfList />} />
              <Route path="/venues" element={<VenueListing />} />
              <Route path="/venues/:id" element={<VenueDetail />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/signup" element={<CustomerSignup />} />
            </Routes>
          </div>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
