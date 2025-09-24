import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Settings as SettingsIcon, Database, Bell, Palette } from 'lucide-react'
import { useDashboardStore } from '@/store/useDashboardStore'

export function Settings() {
  const { darkMode, setDarkMode, realtimeOn, setRealtimeOn } = useDashboardStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your dashboard preferences and system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Updates */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data & Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Real-time Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Enable live data streaming for charts
                </p>
              </div>
              <Switch
                checked={realtimeOn}
                onCheckedChange={setRealtimeOn}
                aria-label="Toggle real-time updates"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Connection</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Socket.IO</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Source</span>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  CSV + Demo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Threshold Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when parameters exceed limits
                </p>
              </div>
              <Switch defaultChecked aria-label="Toggle threshold alerts" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Optimization Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  Receive AI-powered efficiency recommendations
                </p>
              </div>
              <Switch defaultChecked aria-label="Toggle optimization suggestions" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              Export Data
            </Button>
            <Button variant="outline">
              Reset Settings
            </Button>
            <Button variant="outline">
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
