import React, { useEffect, useState } from 'react'
import CheckPanel from './Elements/CheckPanel'
import CalendarPanel from './Elements/CalendarPanel'

const DayView = () => {
    const [day, setDay] = useState(null)
    
    return (
        <div className='flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4'>
            <CalendarPanel setGlobalDay={setDay}>

            </CalendarPanel>
            <CheckPanel day={day}>

            </CheckPanel>
        </div >
    )
}

export default DayView