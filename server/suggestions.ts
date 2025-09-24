import { Suggestion } from './types';

// Mock suggestions generator
export const generateSuggestions = (): Suggestion[] => {
  const suggestions: Suggestion[] = [
    {
      id: 'sug-001',
      title: 'Increase TOTAL AIR FLOW by 3%',
      reason: 'O2 trending low; raising air improves combustion margin.',
      feature: 'TOTAL AIR FLOW ACTUAL',
      delta: '+3%',
      priority: 'high',
      confidence: 0.78
    },
    {
      id: 'sug-002',
      title: 'Monitor MAIN STEAM PRESSURE closely',
      reason: 'Pressure approaching upper threshold. Consider load adjustment.',
      feature: 'MAIN STEAM PRESSURE',
      delta: 'Monitor',
      priority: 'medium',
      confidence: 0.65
    },
    {
      id: 'sug-003',
      title: 'Optimize ECONOMIZER performance',
      reason: 'Temperature differential could be improved for better efficiency.',
      feature: 'ECONOMIZER OUTLET TEMPERATURE',
      delta: '+2°C',
      priority: 'low',
      confidence: 0.82
    },
    {
      id: 'sug-004',
      title: 'Check ID FAN bearing temperatures',
      reason: 'Bearing temperatures slightly elevated. Monitor for trends.',
      feature: 'ID FAN NDE BEARING TEMP',
      delta: 'Check',
      priority: 'medium',
      confidence: 0.71
    },
    {
      id: 'sug-005',
      title: 'Adjust FURNACE PRESSURE',
      reason: 'Pressure slightly negative. Consider damper adjustment.',
      feature: 'FURNACE PRESSURE BOILER 11',
      delta: '+0.5 kPa',
      priority: 'low',
      confidence: 0.58
    },
    {
      id: 'sug-006',
      title: 'Optimize STACK temperature',
      reason: 'Stack temperature could be reduced for better efficiency.',
      feature: 'STACK TEMPERATOR',
      delta: '-5°C',
      priority: 'medium',
      confidence: 0.74
    }
  ];

  // Randomly select 3-5 suggestions
  const numSuggestions = Math.floor(Math.random() * 3) + 3;
  return suggestions
    .sort(() => Math.random() - 0.5)
    .slice(0, numSuggestions);
};

export const getTopSuggestions = (limit: number = 3): Suggestion[] => {
  return generateSuggestions()
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, limit);
};
