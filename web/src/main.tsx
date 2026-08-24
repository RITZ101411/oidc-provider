import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Consent from './pages/Consent';
import Dashboard from './pages/Dashboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
