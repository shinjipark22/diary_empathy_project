import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarSection({selectedDate, onChangeDate}) {
    return <div className = "calendar-section">
        <Calendar
          onChange = {onChangeDate}
          value  = {selectedDate}  
            />
    </div>
}