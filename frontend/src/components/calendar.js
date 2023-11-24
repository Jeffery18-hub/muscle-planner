import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import styled from 'styled-components'
import { useState } from'react'
import axios from 'axios'


const Calendar = ({callback}) => {
    const [events, setEvents] = useState([]);

    const dataFetch = async (info) => {
        // console.log(`${info.startStr} to ${info.endStr}`);
        // TODO: fetch data from the server, hard code uid = 5
        const response = await axios.get('http://localhost:5001/dashboard/calendar?id=5&startDate=' + info.startStr + '&endDate=' + info.endStr);
        setEvents(response.data);
    }

    return (
        <CalendarContainer>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                events={events}
                dayMaxEventRows={2}
                headerToolbar={{
                    left: 'today,prev,next',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                }}
                eventClick={callback}
                datesSet={dataFetch}
            />
        </CalendarContainer>
    )
}


const CalendarContainer = styled.div`
    width: 95%;
`

export default Calendar;