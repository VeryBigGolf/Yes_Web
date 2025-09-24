import { useDashboardStore } from '@/store/useDashboardStore'

export function navigateToFeature(feature: string, timeRange?: string) {
  const store = useDashboardStore.getState()
  
  // Update store with new feature and time range
  store.setSelectedFeature(feature)
  if (timeRange) {
    store.setTimeRange(timeRange)
  }
  
  // Navigate to Time Series page
  // This would typically use a router, but for simplicity we'll just update the store
  // In a real app, you'd use: router.push('/time-series')
}

export function getFeatureUrl(feature: string, timeRange?: string): string {
  const params = new URLSearchParams()
  params.set('feature', feature)
  if (timeRange) {
    params.set('range', timeRange)
  }
  return `/time-series?${params.toString()}`
}

export function parseFeatureFromUrl(): { feature?: string; timeRange?: string } {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  return {
    feature: params.get('feature') || undefined,
    timeRange: params.get('range') || undefined
  }
}
