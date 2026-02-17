import DiaryPage from './pages/DiaryPage';

import CalendarPage from './pages/CalendarPage';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import AuthCallbackPage from './pages/AuthCallbackPage.jsx';



function App() {
  const token = localStorage.getItem('accessToken');
  const isLoggedIn = !!token && token !== 'null' && token !== 'undefined';

  return <div>
    <Router>
    <header className="diary-page__header">

        <h1 className="diary-page__title">감정 캘린더 서비스</h1>
        <p className='diary-page-main'>오늘의 감정을 기록하고, AI의 따뜻한 공감을 받아보세요.</p>
      
      </header>
      
    
    <Routes>
      <Route path = "/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/" element={isLoggedIn ? <div className='app-container'> <CalendarPage /></div> : <Navigate to="/login" replace />} />
      <Route path = "/diary/:date" element = {isLoggedIn ? <DiaryPage /> : <Navigate to="/login" replace />} />
      <Route path="*" element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
    </Routes>
   
    </Router>
    

   </div>
}

export default App;
