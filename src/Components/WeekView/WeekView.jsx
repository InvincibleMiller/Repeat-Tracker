import React, { useState } from 'react'
import CalendarPanel from './Elements/CalendarPanel'
import WeekPanel from './Elements/WeekPanel'

const WeekView = () => {
    const [day, setDay] = useState(new Date())

    return (
        <div className='flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4'>
            <CalendarPanel setGlobalDay={setDay}/>
            <WeekPanel week={day}/>
        </div>
    )
}

export default WeekView