import DiaryPage from './pages/DiaryPage';

import CalendarPage from './pages/CalendarPage';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState } from 'react';



function App() {

  return <div>
    <Router>
    <header className="diary-page__header">

        <h1 className="diary-page__title">감정 캘린더 서비스</h1>
        <p className='diary-page-main'>오늘의 감정을 기록하고, AI의 따뜻한 공감을 받아보세요.</p>
        <button>로그아웃</button>
      </header>
   
    <Routes>
      
      <Route path="/" element={<div className='app-container'> <CalendarPage /></div>} />
      
      <Route path = "/diary/:date" element = {<DiaryPage />} />
    </Routes>
   
    </Router>
    

   </div>
}

export default App;
