import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTop = () => {
    // Only scroll to top if we're already on the upload page
    if (location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Navigate to home page if on different page
      navigate('/');
    }
  };

  const scrollToUploadVideo = () => {
    const uploadVideoSection = document.getElementById('upload-video');
    
    // Check if we're on the upload video page by looking for the upload-video section
    if (uploadVideoSection) {
      // We're on the upload video page, scroll to the section
      uploadVideoSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    } else {
      // We're not on the upload video page, navigate to upload page with hash
      navigate('/#upload-video');
    }
  };

  const scrollToAboutUs = () => {
    const aboutUsSection = document.getElementById('about-us');
    
    // Check if we're on the upload video page by looking for the about-us section
    if (aboutUsSection) {
      // We're on the upload video page, scroll to the section
      aboutUsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // We're not on the upload video page, navigate to upload page with hash
      navigate('/#about-us');
    }
  };

  return (
      <header className="header-section">
          <a onClick={scrollToTop} style={{ cursor: 'pointer' }}>
            <img src={process.env.PUBLIC_URL + '/assets/OrgLogo.png'} alt="Organization Logo" />
          </a>
          <div className="header-section-buttons">
            <a onClick={scrollToAboutUs} className="header-link">About Us</a>
            <a href="/displaySources">Past Results</a>
          </div>
          <div>
          <button onClick={scrollToUploadVideo}>Upload Video</button>
          </div>
      </header>
  );
}

function Footer() {
  return (
    <footer className="footer-section">
      <p>&copy; {new Date().getFullYear()} My React App. All rights reserved.</p>
    </footer>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <div style={{ padding: '20px'}}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
export { Header }; 