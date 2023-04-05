import React, { useState, useEffect } from 'react'
import TabButton from './TabButton'

const TabBox = ({ tab, setTab = () => { }, tabs = [] }) => {
    const [tabElements, setTabElements] = useState([])

    useEffect(() => {
        setTabElements(
            tabs.map(({ text, icon }, index) => {
                return <TabButton selected={index === tab} text={text} icon={icon} key={index} onSelect={() => setTab(index)} />
            })
        )
    }, [tab])

    return (
        <div className='flex row border-2 rounded-md my-1'>
            {tabElements}
        </div>
    )
}

export default TabBox