import { useState, useEffect } from 'react'
import RepeatFetcher from './Components/RepeatFetcher'
import NavBar from './Components/NavBar'
import TabContainer from './Components/Tabs/TabContainer'
import DayView from './Components/DayView/DayView'

function App() {

  const [tab, setTab] = useState(1)

  useEffect(() => {
    const dt = new Date

    const rf = new RepeatFetcher()
    rf.getResults(dt)
  }, [])


  return (
    <div className="App">
      <NavBar index={tab} setTab={setTab} />
      <TabContainer tab={tab} tabs={['', <DayView/>]} />
    </div>
  )
}

export default App
