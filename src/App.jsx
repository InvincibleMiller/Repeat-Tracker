import { useState, useEffect } from 'react'
import RepeatFetcher from './Components/RepeatFetcher'
import NavBar from './Components/NavBar'
import TabContainer from './Components/Tabs/TabContainer'
import DayView from './Components/DayView/DayView'

function App() {

  const [tab, setTab] = useState(1)

  useEffect(() => {
    const week = new Date()
    // week.setDate(4)

    const rf = new RepeatFetcher()
    rf.getResults(week)
  }, [])


  return (
    <div className="App">
      <NavBar index={tab} setTab={setTab} />
      <TabContainer tab={tab} tabs={['', <DayView/>]} />
    </div>
  )
}

export default App
