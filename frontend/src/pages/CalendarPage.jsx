import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {
  const navigate = useNavigate();

  const handleClick = (date) => { //react-calendar는 날짜를 클릭하면 자동으로 날짜를 habdleClick에 넘김 
    const formatted = date.toISOString().split('T')[0];
    navigate(`/diary/${formatted}`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Calendar onClickDay={handleClick} />
    </div>
  );
}