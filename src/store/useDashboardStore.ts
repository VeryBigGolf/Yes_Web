import { create } from 'zustand'
import { FeatureKey, TimeRange, Suggestion } from '@/types'

interface DashboardState {
  // UI State
  sidebarCollapsed: boolean
  darkMode: boolean
  currentPage: string
  
  // Data State
  selectedFeature: FeatureKey | null
  timeRange: TimeRange
  realtimeOn: boolean
  
  // Suggestions
  suggestions: Suggestion[]
  topSuggestions: Suggestion[]
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void
  setDarkMode: (dark: boolean) => void
  setCurrentPage: (page: string) => void
  setSelectedFeature: (feature: FeatureKey | null) => void
  setTimeRange: (range: TimeRange) => void
  setRealtimeOn: (on: boolean) => void
  setSuggestions: (suggestions: Suggestion[]) => void
  setTopSuggestions: (suggestions: Suggestion[]) => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  sidebarCollapsed: false,
  darkMode: (() => {
    // Check localStorage first, then default to true
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  })(),
  currentPage: 'overview',
  selectedFeature: null,
  timeRange: '1h',
  realtimeOn: false,
  suggestions: [],
  topSuggestions: [],
  
  // Actions
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setDarkMode: (dark) => {
    set({ darkMode: dark });
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(dark));
    }
  },
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
  setTimeRange: (range) => set({ timeRange: range }),
  setRealtimeOn: (on) => set({ realtimeOn: on }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setTopSuggestions: (topSuggestions) => set({ topSuggestions }),
}))
