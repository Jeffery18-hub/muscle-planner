import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import styled from 'styled-components'

//TODO: make handleclick show all content
const handleDateClick = (arg) => {
    alert(arg.dateStr);
}

const Calendar = () => {
    return (
        <CalendarContainer>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                weekends={false}
                events={[
                    { title: 'training 1', date: '2023-11-01' },
                    { title: 'training 2', date: '2023-11-16' }
                ]}
                dateClick={handleDateClick}
            />
        </CalendarContainer>
    )
}


const CalendarContainer = styled.div`
    width: 95%;
`

export default Calendar;