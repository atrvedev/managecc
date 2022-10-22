import "antd/dist/antd.css";
import { Routes, Route, Navigate, Router } from 'react-router-dom'
import React, { Suspense, lazy } from 'react';
import Login from './routes/Login';
import Main from './routes/Main';




const App = () => (
    <Routes>
      <Route exact path="/home/*" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
    </Routes>
);

export default App;
