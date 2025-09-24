import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

export function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export function getThresholdStatus(value: number, min?: number, max?: number): 'ok' | 'warn' | 'critical' {
  if (min !== undefined && value < min) return 'critical'
  if (max !== undefined && value > max) return 'critical'
  if (min !== undefined && value < min * 1.1) return 'warn'
  if (max !== undefined && value > max * 0.9) return 'warn'
  return 'ok'
}

export function getThresholdColor(status: 'ok' | 'warn' | 'critical'): string {
  switch (status) {
    case 'ok': return 'text-green-500'
    case 'warn': return 'text-yellow-500'
    case 'critical': return 'text-red-500'
    default: return 'text-muted-foreground'
  }
}

export function getThresholdBgColor(status: 'ok' | 'warn' | 'critical'): string {
  switch (status) {
    case 'ok': return 'bg-green-500/10 border-green-500/20'
    case 'warn': return 'bg-yellow-500/10 border-yellow-500/20'
    case 'critical': return 'bg-red-500/10 border-red-500/20'
    default: return 'bg-muted'
  }
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'low': return 'text-blue-500 bg-blue-500/10'
    case 'medium': return 'text-yellow-500 bg-yellow-500/10'
    case 'high': return 'text-red-500 bg-red-500/10'
    default: return 'text-muted-foreground bg-muted'
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
