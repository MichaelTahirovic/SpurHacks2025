import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import DisplaySources from './pages/displaySources';
import UploadVideo from './pages/uploadVideo';

// Import layout
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<UploadVideo />} />
          <Route path="displaySources" element={<DisplaySources />} />
          <Route path="*" element={
            <div>
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for doesn't exist.</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
