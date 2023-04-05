import React, { useEffect, useState } from 'react'
import CheckPanel from '../Elements/CheckPanel'
import CalendarPanel from '../Elements/CalendarPanel'

const DayView = () => {
    const [day, setDay] = useState(null)
    
    return (
        <div className='flex row p-4 space-x-4'>
            <CalendarPanel setGlobalDay={setDay}>

            </CalendarPanel>
            <CheckPanel day={day}>

            </CheckPanel>
        </div >
    )
}

export default DayView