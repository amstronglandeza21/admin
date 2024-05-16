import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Pending from './Pending';

const AppRouter = () => {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pending" element={<Pending />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
