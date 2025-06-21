import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import DisplaySourcesPage from './pages/resultsPage/displaySourcesPage';
import UploadVideoPage from './pages/uploadPage/uploadVideoPage';

// Import layout
import Layout from './globalComponents/Layout';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<UploadVideoPage />} />
          <Route path="displaySources" element={<DisplaySourcesPage />} />
          <Route path="*" element={
            <div>
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for doesn't exist :(.</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
