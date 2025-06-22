import React from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.css';

function Header() {
  return (
      <header className="header-section">
          <a href="/"><img src={process.env.PUBLIC_URL + '/assets/OrgLogo.png'} alt="Organization Logo" /></a>
          <div className="header-section-buttons">
            <a href="/">About Us</a>
            <a href="/">Request Feature</a>
            <a href="/displaySources">Past Results</a>
          </div>
          <div>
          <a href="/"><button>Upload Video</button></a>
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