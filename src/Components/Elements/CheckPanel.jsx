import React, { useEffect, useState } from 'react'
import RepeatFetcher from '../RepeatFetcher'

const CheckPanel = ({ day }) => {
  const [labelCheck, setLabelCheck] = useState(null)
  const [weekCache, setCache] = useState([])
  const [weekStart, setWs] = useState(null)
  const [weekEnd, setWe] = useState(null)

  const rf = new RepeatFetcher()

  useEffect(() => {
    const effect = async () => {
      let cache = []

      if (day != null) {

        // If this week is cached, dont pull it
        if (day >= weekStart && day < weekEnd) { cache = weekCache; }
        else {
          // Reset the cache params
          const dt = new Date(day)
          dt.setHours(0); dt.setMinutes(0); dt.setSeconds(0)
          dt.setDate(dt.getDate() - dt.getDay())
          setWs(new Date(dt))

          dt.setDate(dt.getDate() + 7)
          setWe(dt)

          // Update Cache
          await rf.getResults(day).then((checks) => {
            cache = checks.dailyResults
          })
        }
      }

      setLabelCheck(cache.filter(({ date }) => {
        return date.getDate() === day.getDate()
      })[0])

      setCache(cache)
    }

    effect()
  }, [day])

  const formatDateIntoHeader = (dt) => {
    const str = (dt.getMonth() + '/' + dt.getDate() + '/' + dt.getFullYear())
    return str
  }

  const getListItem = (finding, index, repeat = false) => {
    return <div key={index}>{finding.type}: {finding.product} {repeat && <span className='text-red-600 font-semibold'>x2</span>}</div>
  }

  const parseShift = (shift, name) => {
    const vio = shift.violations.map((finding, i) => {
      return getListItem(finding, i)
    })

    const rep = shift.repeats.map((finding, i) => {
      return getListItem(finding, i, true)
    })

    const anything = rep.length + vio.length

    return <>
      <h4 className="shift-heading">
        {name}: {!anything ? '🏅' : null}
      </h4>
      {anything != 0 &&
        <>
          {vio}
          {rep}
        </>
      }
    </>
  }

  return (
    <div className={`panel w-full ${labelCheck ? '' : ''}
                     transition-all duration-[0.4s]`}>
      {labelCheck &&
        <>
          <div className="heading mb-3 h-10">
            {labelCheck.date ? formatDateIntoHeader(labelCheck.date) : null}
          </div>
          <div className='shift-heading mb-2 text-lg'>
            Score: {labelCheck.score}
          </div>
          <div className="list">
            {parseShift(labelCheck.kitchen.am, 'BOH AM')}
          </div>
          <div className="list">
            {parseShift(labelCheck.front.am, 'FOH AM')}
          </div>
          <div className="list">
            {parseShift(labelCheck.kitchen.pm, 'BOH PM')}
          </div>
          <div className="list">
            {parseShift(labelCheck.front.pm, 'FOH PM')}
          </div>
        </>
      }
    </div>
  )
}

export default CheckPanel