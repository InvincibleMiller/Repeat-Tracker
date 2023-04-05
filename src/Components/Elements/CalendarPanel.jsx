import React, { useState, useEffect } from 'react'
import DayDot from './DayDot'

const CalendarPanel = ({ setGlobalDay }) => {
    const [dayIndex, setDayIx] = useState(0)
    const [selectedDay, setSD] = useState(null)
    const [month, setMonth] = useState([])

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    useEffect(() => {
        setMonth(getMonth())

        if (selectedDay) setGlobalDay(selectedDay)
    }, [selectedDay])

    const getMonth = () => {
        const day = new Date()
        day.setMonth(day.getMonth() + dayIndex)

        // const month = months[day.getMonth()]
        const lastOfMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0)
        const firstOfMonth = new Date(day.getFullYear(), day.getDate() - 1, 1)
        const dayOffset = 0 - firstOfMonth.getDay() + 1

        const dayMatrix = Array.from({ length: 6 }, () => new Array(7).fill(null)).map((arr, i) => {
            return arr.map((nul, ix) => {
                const flatIndex = (i * 7 + ix)
                const d = new Date(firstOfMonth)
                d.setDate(dayOffset + flatIndex)

                const sel = selectedDay && selectedDay.toUTCString() === d.toUTCString()

                return <DayDot key={flatIndex} day={d}
                    inMonth={d <= lastOfMonth && d >= firstOfMonth}
                    onSelect={() => setSD(d)} compare={sel} />
            })
        })

        return dayMatrix
    }

    return (
        <div className='panel w-[24rem] flex flex-col'>

            <h2 className='mb-3 font-bold text-2xl text-gray-600'>April</h2>

            <div className='grid grid-cols-7 gap-0 mb-1'>
                {
                    days.map((l, i) => {
                        return <div key={i} className='text-center'>{l}</div>
                    })
                }
            </div>

            <div className='grid grid-cols-7 gap-0 border-[1px] border-gray-300'>
                {
                    month.flat(1)
                }
            </div>
        </div>
    )
}

export default CalendarPanel