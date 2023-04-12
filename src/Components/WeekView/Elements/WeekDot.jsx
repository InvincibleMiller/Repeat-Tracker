import React, { useEffect, useState } from 'react'

const WeekDot = ({ start, end, onSelect, compare }) => {

    const [bgColor, setBG] = useState('')

    const parseDateQuik = (date) => {
        const str = date.toString()
        const split = str.split(' ')

        return `${split[1]} ${split[2]}`
    }

    useEffect(() => {
        setBG('bg-transparent')
        if (compare) setBG('bg-blue-300')
    })

    return (
        <div className={`first:border-t-0 border-t-[2px] text-xl text-center p-1 ${bgColor}`}
        onClick={onSelect}>
            {parseDateQuik(start)} - {parseDateQuik(end)}
        </div>
    )
}

export default WeekDot