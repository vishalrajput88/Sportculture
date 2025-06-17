import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is available
import { Container, Row, Col } from 'react-bootstrap';
import cultureLogo from '../assets/culture-logo.png'; // Assuming you have a logo

const Footer = () => {
  return (
    <footer className="bg-light py-5 mt-auto" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <Row>
          {/* Column 1: Logo and Description */}
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <img src={cultureLogo} alt="Sports Culture Logo" style={{ height: '40px', marginRight: '10px' }} />
              <h5 className="mb-0">Sports Culture</h5>
            </div>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus.
            </p>
          </Col>

          {/* Column 2: Company Links */}
          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <h5 className="mb-3">Company</h5>
            <ul className="list-unstyled">
              <li><a href="#about" className="text-muted text-decoration-none">About</a></li>
              <li><a href="#games" className="text-muted text-decoration-none">Games</a></li>
              <li><a href="#sctc" className="text-muted text-decoration-none">SC T&C</a></li>
            </ul>
          </Col>

          {/* Column 3: Contact Links */}
          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <h5 className="mb-3">Contact</h5>
            <ul className="list-unstyled">
              <li><a href="#help" className="text-muted text-decoration-none">Help/FAQ</a></li>
              <li><a href="#press" className="text-muted text-decoration-none">Press</a></li>
              <li><a href="#affiliates" className="text-muted text-decoration-none">Affiliates</a></li>
            </ul>
          </Col>

          {/* Column 4: More Links */}
          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <h5 className="mb-3">More</h5>
            <ul className="list-unstyled">
              <li><a href="#ambassador" className="text-muted text-decoration-none">Ambassador</a></li>
              <li><a href="#games" className="text-muted text-decoration-none">Games</a></li>
              <li><a href="#collaboration" className="text-muted text-decoration-none">Collaboration</a></li>
            </ul>
          </Col>

          {/* Column 5: Social Media and App Download */}
          <Col md={3} sm={12}>
            <div className="d-flex justify-content-center justify-content-md-end mb-3">
              {/* Social Icons - Replace with actual icons/components */}
              <a href="#" className="btn btn-light rounded-circle d-flex align-items-center justify-content-center mx-2" style={{ width: '40px', height: '40px' }}>F</a>
              <a href="#" className="btn btn-light rounded-circle d-flex align-items-center justify-content-center mx-2" style={{ width: '40px', height: '40px' }}>I</a>
              <a href="#" className="btn btn-light rounded-circle d-flex align-items-center justify-content-center mx-2" style={{ width: '40px', height: '40px' }}>T</a>
            </div>
            <p className="text-center text-md-end text-muted mb-3">Discover our app</p>
            <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-end gap-2">
              {/* App Store Buttons - Replace with actual images/links */}
              <a href="#" className="d-block"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" style={{ height: '40px' }} /></a>
              <a href="#" className="d-block"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" style={{ height: '40px' }} /></a>
            </div>
          </Col>
        </Row>
        <hr className="mt-5" />
        <p className="text-center text-muted mb-0" style={{ fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} Sports Culture. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer; 