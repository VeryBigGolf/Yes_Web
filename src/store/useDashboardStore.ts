import { create } from "zustand";

type RangeKey = "15m" | "1h" | "8h" | "24h" | "all";

type State = {
  // UI State
  sidebarCollapsed: boolean;
  darkMode: boolean;
  currentPage: string;
  
  // Data State
  selectedFeature: string | null;
  timeRange: RangeKey;
  realtimeOn: boolean;
};

type Actions = {
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  setCurrentPage: (page: string) => void;
  setSelectedFeature: (k: string) => void;
  setTimeRange: (r: RangeKey) => void;
  setRealtimeOn: (on: boolean) => void;
};

export const useDashboardStore = create<State & Actions>((set) => ({
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
  timeRange: "1h",
  realtimeOn: false,
  
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
  setSelectedFeature: (k) => set({ selectedFeature: k }),
  setTimeRange: (r) => set({ timeRange: r }),
  setRealtimeOn: (on) => set({ realtimeOn: on }),
}));
