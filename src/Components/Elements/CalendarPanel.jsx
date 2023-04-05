import { off } from '@firebase/database'
import React, { useState, useEffect } from 'react'
import DayDot from './DayDot'

const CalendarPanel = ({ setGlobalDay }) => {
    const [monthIndex, setDayIx] = useState(0)
    const [selectedDay, setSD] = useState(new Date())
    const [month, setMonth] = useState([])

    const [strMonth, setStrMonth] = useState('')

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

    useEffect(() => {
        const table = getMonth()
        setMonth(table)
        move(0)
    }, [selectedDay, monthIndex])

    const getMonth = () => {
        const day = new Date()
        day.setMonth(day.getMonth() + monthIndex)

        // const month = months[day.getMonth()]
        const lastOfMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0)
        const firstOfMonth = new Date(day.getFullYear(), day.getMonth(), 1)

        const dayOffset = 0 - firstOfMonth.getDay() + 1

        const dayMatrix = Array.from({ length: 6 }, () => new Array(7).fill(null)).map((arr, i) => {
            return arr.map((nul, ix) => {
                const flatIndex = (i * 7 + ix)
                const d = new Date(firstOfMonth)
                d.setDate(dayOffset + flatIndex)

                const sel = selectedDay && selectedDay.toUTCString() === d.toUTCString()

                return <DayDot key={flatIndex} day={d}
                    inMonth={d <= lastOfMonth && d >= firstOfMonth}
                    onSelect={() => { setSD(d); setGlobalDay(d) }} compare={sel} />
            })
        })

        return dayMatrix
    }

    const move = (offset) => {
        setDayIx(monthIndex + offset)
        const dt = new Date()
        dt.setMonth(dt.getMonth() + monthIndex)

        setStrMonth(dt.toString().slice(4, 7) + ' ' + dt.getFullYear())
    }

    return (
        <div className='panel w-[24rem] flex flex-col'>

            <div className='mb-3 inline-flex space-x-2'>
                <span onClick={() => move(-1)} className='calendar-move-btn'>{'<'}</span>
                <span className='heading leading-[0px] py-5 w-32 text-center'>{strMonth}</span>
                <span onClick={() => move(+1)} className='calendar-move-btn'>{'>'}</span>
            </div>

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