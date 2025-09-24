export function formatValue(value: number, unit?: string): string {
  const formatted = value.toFixed(2)
  return unit ? `${formatted} ${unit}` : formatted
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatTemperature(value: number): string {
  return `${value.toFixed(1)}°C`
}

export function formatPressure(value: number): string {
  return `${value.toFixed(1)} kPa`
}

export function formatFlow(value: number): string {
  return `${value.toFixed(1)} m³/h`
}

export function formatCurrent(value: number): string {
  return `${value.toFixed(1)} A`
}

export function getUnitForParameter(parameter: string): string {
  const lowerParam = parameter.toLowerCase()
  
  if (lowerParam.includes('temperature') || lowerParam.includes('temp')) {
    return '°C'
  }
  if (lowerParam.includes('pressure')) {
    return 'kPa'
  }
  if (lowerParam.includes('flow')) {
    return 'm³/h'
  }
  if (lowerParam.includes('current')) {
    return 'A'
  }
  if (lowerParam.includes('oxygen')) {
    return '%'
  }
  if (lowerParam.includes('master') || lowerParam.includes('damper')) {
    return '%'
  }
  
  return ''
}

export function formatParameterValue(parameter: string, value: number): string {
  const unit = getUnitForParameter(parameter)
  return formatValue(value, unit)
}
