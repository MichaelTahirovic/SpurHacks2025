import React from 'react';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
      <footer style={{ 
        background: '#333', 
        color: 'white', 
        textAlign: 'center', 
        padding: '1rem',
        marginTop: '2rem'
      }}>
        <p>&copy; {new Date().getFullYear()} My React App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout; 