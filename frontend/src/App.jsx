import DiaryPage from './pages/DiaryPage';
import './App.css';



function App() {

  return <div>

    <header className="diary-page__header">
        <h1>감정 캘린더 서비스</h1>
        <p>오늘의 감정을 기록하고, AI의 따뜻한 공감을 받아보세요.</p>
    </header> 
    <DiaryPage></DiaryPage>
    

   </div>
}

export default App;
