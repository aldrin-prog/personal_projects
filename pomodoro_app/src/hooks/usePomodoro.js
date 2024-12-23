import { useState, useEffect, useCallback } from 'react';

export function usePomodoro(initialSettings) {
  const [settings, setSettings] = useState(initialSettings);
  const [time, setTime] = useState(settings.workTime);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const reset = useCallback(() => {
    setTime(getTimeForCurrentMode());
    setIsActive(false);
  }, [mode, settings]);

  const getTimeForCurrentMode = useCallback(() => {
    switch (mode) {
      case 'work':
        return settings.workTime;
      case 'short-break':
        return settings.shortBreakTime;
      case 'long-break':
        return settings.longBreakTime;
    }
  }, [mode, settings]);

  const toggleMode = useCallback(() => {
    if (mode === 'work') {
      setCompletedPomodoros((prev) => prev + 1);
      if (completedPomodoros % settings.longBreakInterval === settings.longBreakInterval - 1) {
        setMode('long-break');
      } else {
        setMode('short-break');
      }
    } else {
      setMode('work');
    }
    reset();
  }, [mode, completedPomodoros, settings, reset]);

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      toggleMode();
      playNotificationSound();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, toggleMode]);

  const toggleTimer = useCallback(() => {
    setIsActive((prevActive) => !prevActive);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
    reset();
  }, [reset]);

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play();
  };

  return { 
    time, 
    isActive, 
    mode, 
    completedPomodoros, 
    settings,
    toggleTimer, 
    reset, 
    toggleMode, 
    updateSettings 
  };
}
