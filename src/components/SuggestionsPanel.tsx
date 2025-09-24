import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, TrendingUp, CheckCircle } from 'lucide-react'
import { Suggestion } from '@/types'
import { getPriorityColor, cn } from '@/lib/utils'
import { navigateToFeature } from '@/lib/route'

interface SuggestionsPanelProps {
  suggestions: Suggestion[]
  loading?: boolean
  compact?: boolean
}

export function SuggestionsPanel({ suggestions, loading = false, compact = false }: SuggestionsPanelProps) {
  if (loading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No suggestions available at this time.</p>
            <p className="text-sm">All systems are operating optimally.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          {compact ? 'Top Suggestions' : 'Suggestions'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getPriorityColor(suggestion.priority))}
                  >
                    {suggestion.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {suggestion.reason}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Feature: {suggestion.feature}</span>
                  <span>Impact: {suggestion.delta}</span>
                  <span>Confidence: {Math.round(suggestion.confidence * 100)}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigateToFeature(suggestion.feature)}
                className="text-xs"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                View Feature
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled
                className="text-xs"
              >
                Apply
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
