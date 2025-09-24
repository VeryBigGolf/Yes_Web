import { Suggestion } from "@/hooks/useSuggestions";
import { cn } from "@/lib/utils";

const badgeByPriority: Record<Suggestion["priority"], string> = {
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  high: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default function SuggestionCard({
  s, onView,
}: { s: Suggestion; onView: (feature: string)=>void }) {
  return (
    <div className="rounded-2xl border p-4 hover:bg-muted/30 transition">
      <div className="flex items-start justify-between">
        <h4 className="font-medium leading-tight pr-3">{s.title}</h4>
        <span className={cn("px-2 py-0.5 text-xs rounded-full border", badgeByPriority[s.priority])}>
          {s.priority}
        </span>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{s.reason}</div>
      <div className="mt-2 text-sm">
        <span className="font-medium">{s.feature}</span>
        <span className="text-muted-foreground"> • target </span>
        <span className="font-medium">{s.delta}</span>
        <span className="text-muted-foreground"> • conf </span>
        <span className="font-medium">{(s.confidence*100).toFixed(0)}%</span>
      </div>
      <div className="mt-3">
        <button
          onClick={() => onView(s.feature)}
          className="text-sm rounded-md border px-3 py-1 hover:bg-muted"
        >
          View related feature
        </button>
      </div>
    </div>
  );
}
