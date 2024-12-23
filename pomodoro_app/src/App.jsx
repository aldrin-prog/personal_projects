import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from './components/ui/button'
import { Pomodoro } from './pages/Pomodoro'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Pomodoro/>
  )
}

export default App
