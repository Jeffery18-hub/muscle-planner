import { useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';


function MyDatePicker() {
  const [value, onChange] = useState(new Date());
  //console.log(value);

  return (
        <div style={{ margin: '20px' }}>
      <DatePicker onChange={onChange} value={value} />
        </div>
    );
}

export default MyDatePicker;