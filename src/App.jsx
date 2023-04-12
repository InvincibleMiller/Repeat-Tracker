import { useState, useEffect } from 'react'
import NavBar from './Components/NavBar'
import TabContainer from './Components/Tabs/TabContainer'
import DayView from './Components/DayView/DayView'
import WeekView from './Components/WeekView/WeekView'

function App() {

  const [tab, setTab] = useState(1)

  return (
    <div className="App h-full w-full">
      <NavBar index={tab} setTab={setTab} />
      <TabContainer tab={tab} tabs={[<WeekView />, <DayView />]} />
    </div>
  )
}

export default App
