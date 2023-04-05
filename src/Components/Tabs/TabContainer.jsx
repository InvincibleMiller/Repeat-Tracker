import React from 'react'

const TabContainer = ({ tab, tabs }) => {
    return (
        <>
            {tabs[tab]}
        </>
    )
}

export default TabContainer