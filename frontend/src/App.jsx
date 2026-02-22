import DiaryPage from './pages/DiaryPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header';
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
        <Header />
      
    
    <Routes>
      <Route path = "/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/" element={isLoggedIn ? <div className='app-container'> <CalendarPage /></div> : <Navigate to="/login" replace />} />
      <Route path = "/diary/:date" element = {isLoggedIn ? <DiaryPage /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />} />
      <Route path="*" element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
    </Routes>
   
    </Router>
    

   </div>
}

export default App;
