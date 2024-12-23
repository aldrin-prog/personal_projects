import React, { useState } from 'react'
import { usePomodoro } from '../hooks/usePomodoro'
// import { CircularTimer } from './CircularTimer'
import { CircularTimer } from '@/components/CircularTimer'
// import { TaskList } from './TaskList'
// import { Analytics } from './Analytics'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TaskList } from '@/components/TaskList'
import { Analytics } from '@/components/Analytics'

export function Pomodoro() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { 
    time, 
    isActive, 
    mode, 
    completedPomodoros,
    settings,
    toggleTimer, 
    reset, 
    toggleMode, 
    updateSettings 
  } = usePomodoro({
    workTime: 25 * 60,
    shortBreakTime: 5 * 60,
    longBreakTime: 15 * 60,
    longBreakInterval: 4
  })

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  

  const getProgress = () => {
    const totalTime = mode === 'work' 
      ? settings.workTime 
      : mode === 'short-break' 
        ? settings.shortBreakTime 
        : settings.longBreakTime
    return 1 - time / totalTime
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 gap-x-5 md:grid-cols-2">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-6">
            <div className="flex justify-between w-full">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Pomodoro Timer</h1>
              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
            </div>
            <CircularTimer progress={getProgress()} time={formatTime(time)} mode={mode} />
            <div className="flex space-x-4">
              <Button onClick={toggleTimer} variant={isActive ? "destructive" : "default"}>
                {isActive ? 'Pause' : 'Start'}
              </Button>
              <Button onClick={reset} variant="outline">Reset</Button>
            </div>
            <Button onClick={toggleMode} variant="ghost" className="w-full">
              Switch to {mode === 'work' ? 'Break' : 'Work'}
            </Button>
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="work-time">Work Time (minutes)</Label>
                <Input
                  id="work-time"
                  type="number"
                  value={settings.workTime / 60}
                  onChange={(e) => updateSettings({ workTime: parseInt(e.target.value) * 60 })}
                  className="w-20"
                />
              </div>
              <div className="flex justify-between items-center">
                <Label htmlFor="short-break-time">Short Break Time (minutes)</Label>
                <Input
                  id="short-break-time"
                  type="number"
                  value={settings.shortBreakTime / 60}
                  onChange={(e) => updateSettings({ shortBreakTime: parseInt(e.target.value) * 60 })}
                  className="w-20"
                />
              </div>
              <div className="flex justify-between items-center">
                <Label htmlFor="long-break-time">Long Break Time (minutes)</Label>
                <Input
                  id="long-break-time"
                  type="number"
                  value={settings.longBreakTime / 60}
                  onChange={(e) => updateSettings({ longBreakTime: parseInt(e.target.value) * 60 })}
                  className="w-20"
                />
              </div>
              <div className="flex justify-between items-center">
                <Label htmlFor="long-break-interval">Long Break Interval</Label>
                <Input
                  id="long-break-interval"
                  type="number"
                  value={settings.longBreakInterval}
                  onChange={(e) => updateSettings({ longBreakInterval: parseInt(e.target.value) })}
                  className="w-20"
                />
              </div>
            </div>
          </CardContent>
        </Card> 
        <div>
            <TaskList/>
            <Analytics 
            completedPomodoros={completedPomodoros} 
            totalFocusTime={completedPomodoros * settings.workTime / 60}
            />
        </div>
      </div>
    </div>
  )
}

