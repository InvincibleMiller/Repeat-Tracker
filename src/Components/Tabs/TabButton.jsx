import React, { useEffect, useState } from 'react'

const TabButton = ({ text, icon, onSelect, selected = false }) => {
    return (
        <div className={`py-1 px-3 transition-all duration-[0.3s] ${selected ? 'bg-white text-red-500' : ''}`} onClick={onSelect}>
            {text} {icon ? icon : null}
        </div>
    )
}

export default TabButton