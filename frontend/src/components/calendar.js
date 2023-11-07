// this file is never used

import { useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';


function Calendar() {
  const [value, onChange] = useState(new Date());
  //console.log(value);

  return (
        <div style={{ margin: '20px' }}>
      <DatePicker onChange={onChange} value={value} />
        </div>
    );
}

export default Calendar;