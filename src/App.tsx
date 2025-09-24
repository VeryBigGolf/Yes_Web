import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import ChatDrawer from '@/components/ChatDrawer'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { useDashboardStore } from '@/store/useDashboardStore'
import Overview from '@/pages/Overview'
import TimeSeries from '@/pages/TimeSeries'
import { Suggestions } from '@/pages/Suggestions'
import { Settings } from '@/pages/Settings'

function App() {
  const { currentPage, darkMode } = useDashboardStore()
  const [chatOpen, setChatOpen] = useState(false)

  // Apply dark mode on mount and when it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }, [darkMode])


  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />
      case 'time-series':
        return <TimeSeries />
      case 'suggestions':
        return <Suggestions />
      case 'settings':
        return <Settings />
      default:
        return <Overview />
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Header />
          {/* full-bleed content with light gutters */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 max-w-full">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Chat FAB */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
        size="icon"
        onClick={() => setChatOpen(true)}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Drawer */}
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}

export default App
