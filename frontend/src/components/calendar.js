import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import styled from 'styled-components'


const Calendar = () => {
    return (
        <CalendarContainer>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
            />
        </CalendarContainer>
    )
}

const CalendarContainer = styled.div`
    width: 80%;
    padding: 20px;
`

export default Calendar;