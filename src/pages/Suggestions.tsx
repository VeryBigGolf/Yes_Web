import { SuggestionsPanel } from '@/components/SuggestionsPanel'
import { useSuggestions } from '@/hooks/useCsvData'

export function Suggestions() {
  const { suggestions, loading, error } = useSuggestions()

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Suggestions</h1>
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-2xl">
          <h2 className="font-semibold text-destructive mb-2">Error Loading Suggestions</h2>
          <p className="text-destructive/80">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Optimization Suggestions</h1>
        <p className="text-muted-foreground">
          AI-powered recommendations to improve boiler efficiency and performance.
        </p>
      </div>

      <SuggestionsPanel suggestions={suggestions} loading={loading} />
    </div>
  )
}
