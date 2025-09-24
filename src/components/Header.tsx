import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Moon, Sun } from 'lucide-react'
import { useDashboardStore } from '@/store/useDashboardStore'
import { formatTimeAgo } from '@/lib/utils'

export function Header() {
  const { darkMode, setDarkMode } = useDashboardStore()
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    // Update last updated time every minute
    const updateTime = () => {
      setLastUpdated(new Date().toISOString())
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    // Apply dark mode class to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }


  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Left: title + updated */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-base sm:text-lg font-semibold">Boiler 11 — Operations Dashboard</h1>
          <span className="text-xs text-muted-foreground">
            Last updated: {lastUpdated ? formatTimeAgo(lastUpdated) : 'Loading...'}
          </span>
        </div>
        {/* Right: theme toggle */}
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          <Switch
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
            aria-label="Toggle dark mode"
          />
          <Moon className="h-4 w-4" />
        </div>
      </div>
    </header>
  )
}
