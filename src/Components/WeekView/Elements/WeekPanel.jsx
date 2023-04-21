import React, { useEffect, useState } from 'react'
import RepeatFetcher from '../../RepeatFetcher'
import Grader from '../../../Grader'

const WeekPanel = ({ week }) => {
    const [weeklyData, setWeeklyData] = useState(null)

    useEffect(() => {
        if (!week) return

        const effect = async () => {
            const rf = new RepeatFetcher()
            const res = await rf.getResults(week)

            setWeeklyData(res)
            console.log(weeklyData);
        }

        effect()
    }, [week])

    const grader = new Grader()

    const parseDateQuik = (date) => {
        const str = date.toString()
        const split = str.split(' ')

        return `${split[1]} ${split[2]} ${split[3]}`
    }

    const getDateRange = (date) => {
        const d = new Date(date)
        d.setDate(d.getDate() + 7)

        const str1 = parseDateQuik(date)
        const str2 = parseDateQuik(d)

        return `${str1} - ${str2}`
    }

    const getLabelCheckCompletionRate = (totalCounted, expectedLabelChecks) => {
        return Math.floor((totalCounted / expectedLabelChecks * 100))
    }

    const getCompletionTables = () => {
        if (!weeklyData) return null
        const dailies = weeklyData.dailyResults
        const daysCompleted = dailies.length

        let [fAM, fPM, kAM, kPM] = new Array(4).fill(0)
        const labelChecksExpectedDuringWeekPerShift = 2 * daysCompleted

        dailies.forEach((day) => {
            fAM += day.front.am.totalLabelChecks
            fPM += day.front.pm.totalLabelChecks
            kAM += day.kitchen.am.totalLabelChecks
            kPM += day.kitchen.pm.totalLabelChecks
        });

        const scoreFAM = getLabelCheckCompletionRate(fAM, labelChecksExpectedDuringWeekPerShift)
        const scoreFPM = getLabelCheckCompletionRate(fPM, labelChecksExpectedDuringWeekPerShift)
        const scoreKAM = getLabelCheckCompletionRate(kAM, labelChecksExpectedDuringWeekPerShift)
        const scoreKPM = getLabelCheckCompletionRate(kPM, labelChecksExpectedDuringWeekPerShift)

        return (
            <>
                <div className="sub-panel">
                    <div className='sub-panel-2'>
                        <h2 className='shift-heading mb-2 text-lg'>Average Completion Rates:</h2>
                        <table className='border-collapse sub-panel border-[2px]'>
                            <thead>
                                <tr>
                                    <th className='t-cell'></th>
                                    <th className='t-cell'>AM</th>
                                    <th className='t-cell'>PM</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className='t-cell'>Front</th>
                                    <td className='t-cell'>{scoreFAM + '%'}</td>
                                    <td className='t-cell'>{scoreFPM + '%'}</td>
                                </tr>
                                <tr>
                                    <th className='t-cell'>Kitchen</th>
                                    <td className='t-cell'>{scoreKAM + '%'}</td>
                                    <td className='t-cell'>{scoreKPM + '%'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="sub-panel">
                    <div className='sub-panel-2'>
                        <h2 className='shift-heading mb-2 text-lg'>Graded Completion Rates:</h2>
                        <table className='border-collapse sub-panel border-[2px]'>
                            <thead>
                                <tr>
                                    <th className='t-cell'></th>
                                    <th className='t-cell'>AM</th>
                                    <th className='t-cell'>PM</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th className='t-cell'>Front</th>
                                    <td className='t-cell'>{grader.getGrade(scoreFAM)}</td>
                                    <td className='t-cell'>{grader.getGrade(scoreFPM)}</td>
                                </tr>
                                <tr>
                                    <th className='t-cell'>Kitchen</th>
                                    <td className='t-cell'>{grader.getGrade(scoreKAM)}</td>
                                    <td className='t-cell'>{grader.getGrade(scoreKPM)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className={`panel w-full origin-top ${weeklyData ? 'scale-y-100' : 'scale-y-0'}
                         transition-all duration-[0.4s]`}>
            <div className="heading mb-3 h-10">
                {week && getDateRange(week)}
            </div>
            <div className='sub-panel mb-2'>
                <h2 className="shift-heading">
                    Results
                </h2>
                <div className="sub-panel-2">
                    <h2 className='shift-heading text-lg'>Score: {weeklyData && Math.floor(weeklyData.weeksResult.score * 100) / 100}</h2>
                </div>
            </div>
            <div className="sub-panel-container">
                <div className="flex-col">
                    <h2 className="shift-heading">
                        Data
                    </h2>
                    <div className="sub-panel-container">
                        {weeklyData && getCompletionTables()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeekPanel