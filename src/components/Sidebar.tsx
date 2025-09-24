import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Lightbulb, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react'
import { useDashboardStore } from '@/store/useDashboardStore'
import { useClientCsv } from '@/hooks/useClientCsv'
import { cn } from '@/lib/utils'

const navigation = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'time-series', label: 'Time Series', icon: TrendingUp },
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'debug', label: 'Debug', icon: Settings },
]

export function Sidebar() {
  const { 
    sidebarCollapsed, 
    currentPage, 
    setCurrentPage, 
    selectedFeature, 
    setSelectedFeature 
  } = useDashboardStore()
  
  const { columns: parameters, loading } = useClientCsv()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredParameters = parameters.filter(param =>
    param.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleParameterClick = (parameter: string) => {
    setSelectedFeature(parameter)
    setCurrentPage('time-series')
  }

  return (
    <aside className={cn(
      "w-[260px] shrink-0 border-r bg-background/95 backdrop-blur hidden md:flex flex-col transition-all duration-300",
      sidebarCollapsed ? "w-16" : "w-80"
    )}>
      <div className="p-3 sm:p-4 space-y-3 overflow-y-auto h-[calc(100dvh-56px)] md:h-[100dvh]">
        {/* Navigation */}
        <nav>
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                  onClick={() => setCurrentPage(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {!sidebarCollapsed && <span className="ml-2">{item.label}</span>}
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => useDashboardStore.getState().setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        {/* Parameters list */}
        {!sidebarCollapsed && (
          <div className="flex-1 overflow-hidden border-t">
            <div>
              <div className="relative mb-4 p-3">
                <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search parameters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-1 px-3">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Parameters ({filteredParameters.length})
                </h3>
                
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-1">
                    {filteredParameters.map((parameter) => (
                      <Button
                        key={parameter}
                        variant={selectedFeature === parameter ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-left h-auto p-2"
                        onClick={() => handleParameterClick(parameter)}
                      >
                        <div className="flex flex-col items-start w-full">
                          <span className="text-xs font-medium truncate w-full">
                            {parameter}
                          </span>
                          {selectedFeature === parameter && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
