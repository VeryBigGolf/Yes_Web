export type FeatureKey = string; // CSV column except 'Time'
export type DataPoint = { t: string; v: number }; // ISO timestamp + numeric value

export type Suggestion = {
  id: string;
  title: string;
  reason: string;
  feature: FeatureKey;
  delta: string; // e.g., "+3%"
  priority: 'low' | 'medium' | 'high';
  confidence: number; // 0..1
};

export type ChatMessage = {
  id: string;
  text: string;
  timestamp: string;
  isUser: boolean;
};

export type ChatResponse = {
  reply: string;
};

export type RealtimeTick = {
  feature: string;
  t: string;
  v: number;
};

export type TimeRange = '15m' | '1h' | '8h' | '24h' | string;

export type ThresholdStatus = 'ok' | 'warn' | 'critical';
