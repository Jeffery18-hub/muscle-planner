import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import styled from 'styled-components'


const Calendar = ({onEventClick, dataFetch, events}) => {
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
                eventClick={onEventClick}
                datesSet={dataFetch}
            />
        </CalendarContainer>
    )
}


const CalendarContainer = styled.div`
    width: 95%;
    margin: 10px;
    height: 100%;
`

export default Calendar;