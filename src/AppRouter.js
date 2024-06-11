import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import App from './App';
import Pending from './Pending';
import Status from './Status';
import NotFound from './NotFound'; 

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/status" element={<Status />} />
        <Route path="*" element={<NotFound />} /> 
      </Routes>
    </Router>
  );
};

export default AppRouter;
