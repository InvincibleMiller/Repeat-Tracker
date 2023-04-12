import { off } from '@firebase/database'
import React, { useState, useEffect } from 'react'
import WeekDot from './WeekDot'

const CalendarPanel = ({ setGlobalDay }) => {
    const [monthIndex, setMonthIx] = useState(0)
    const [selectedWeek, setSW] = useState(new Date())
    const [month, setMonth] = useState([])

    const [strMonth, setStrMonth] = useState('')

    useEffect(() => {
        setMonth(getWeeks())
        move(0)
    }, [selectedWeek, monthIndex])

    const getWeeks = () => {
        const day = new Date()
        day.setMonth(day.getMonth() + monthIndex)

        // const month = months[day.getMonth()]
        const firstOfMonth = new Date(day.getFullYear(), day.getMonth(), 1)

        const d = new Date(firstOfMonth)
        d.setDate(d.getDate() - d.getDay())

        const dayMatrix = Array.from({ length: 5 }, () => null).map((week, i) => {
            const weekIndex = (i * 7)
            const startDate = new Date(d)
            startDate.setDate(d.getDate() + weekIndex)

            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + 7)

            return <WeekDot key={i} start={startDate} end={endDate}
                onSelect={() => { setSW(startDate); setGlobalDay(startDate) }} compare={selectedWeek.toString() === startDate.toString()} /> // <-- LOOSE END __ NEEDS FIXING
        })

        return dayMatrix
    }

    const move = (offset) => {
        setMonthIx(monthIndex + offset)
        const dt = new Date()
        dt.setMonth(dt.getMonth() + monthIndex)

        setStrMonth(dt.toString().slice(4, 7) + ' ' + dt.getFullYear())
    }

    return (
        <div className='panel w-full md:w-[24rem] flex flex-col'>

            <div className='mb-3 inline-flex space-x-2'>
                <span onClick={() => move(-1)} className='calendar-move-btn'>{'<'}</span>
                <span className='heading leading-[0px] py-5 w-32 text-center'>{strMonth}</span>
                <span onClick={() => move(+1)} className='calendar-move-btn'>{'>'}</span>
            </div>

            <div className='flex flex-col gap-0 border-[1px] border-gray-300'>
                {
                    month.flat(1)
                }
            </div>
        </div>
    )
}

export default CalendarPanel