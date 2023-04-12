import React, { useEffect } from 'react'
import RepeatFetcher from '../../RepeatFetcher'

const WeekPanel = ({ week }) => {

    useEffect(() => {
        const effect = async () => {
            const rf = new RepeatFetcher()
            const res = await rf.getResults(week)

            console.log(res);
        }

        effect()
    }, [week])

    return (
        <div className='panel'>WeekPanel</div>
    )
}

export default WeekPanel