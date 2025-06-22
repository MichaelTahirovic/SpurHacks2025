import React, { useEffect } from 'react';
import UploadVideo from './components/UploadVideo';
import HookText from './components/HookText';
import AboutUs from './components/AboutUs';


function UploadVideoPage() {
  useEffect(() => {
    // Check if there's a hash in the URL (e.g., #about-us or #upload-video)
    // eslint-disable-next-line no-restricted-globals
    if (window.location.hash) {
      // Remove the # symbol
      // eslint-disable-next-line no-restricted-globals
      const elementId = window.location.hash.substring(1);
      const element = document.getElementById(elementId);
      
      if (element) {
        // Small delay to ensure the page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }
    }
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <>
    <HookText />
    <UploadVideo />
    <AboutUs />
    </>
  )
}

export default UploadVideoPage; 