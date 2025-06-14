import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import cultureLogo from '../assets/culture-logo.png';

const Header = () => {
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
      <nav className={`bg-white py-4 px-6 shadow-sm flex justify-between items-center ${styles.nav_container}`}>
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
        <div className="flex items-center space-x-4">
          <select className="bg-gray-100 p-2 rounded-md border border-gray-300 text-gray-700 text-sm">
            <option>Ahmadabad</option>
            {/* Add more locations as needed */}
          </select>
          <Link to="/login" className="bg-[#6a1b9a] text-white px-5 py-2 rounded-md hover:bg-purple-800 hidden md:block font-semibold text-base">
            Login
          </Link>
          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700 focus:outline-none">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header; 