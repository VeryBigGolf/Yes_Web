import { useEffect, useState } from "react";

export type Suggestion = {
  id: string;
  title: string;
  reason: string;
  feature: string;
  delta: string;
  priority: "low" | "medium" | "high";
  confidence: number; // 0..1
};

export function useSuggestions() {
  const [data, setData] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetch("/api/suggestions")
      .then(r => r.json())
      .then(j => alive && setData(j))
      .catch(e => alive && setError(String(e)))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, []);

  return { data, loading, error };
}
