import React, { useEffect, useState } from 'react'

const DayDot = ({ day, inMonth, onSelect, compare }) => {
    const [bgColor, setBG] = useState('')
    const [check, setCheck] = useState(false)

    useEffect(() => {
        setBG('bg-transparent')
        if (!inMonth) setBG('bg-gray-200')
        if (compare) setBG('bg-blue-300')
    })

    const clicked = () => {
        onSelect()
    }

    return (
        <div onClick={clicked} className={`${bgColor} text-center h-[2rem] leading-[0px] py-[1rem] hover:cursor-pointer`}>{day.getDate()}</div>
    )
}

export default DayDot