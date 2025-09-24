import { useEffect, useState } from "react";

export type DataPoint = { t: string; v: number };

export function useParameters() {
  const [params, setParams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/parameters")
      .then((r) => r.json())
      .then(setParams)
      .finally(() => setLoading(false));
  }, []);
  return { params, loading };
}

export function useSeries(feature: string, range: string) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!feature) return;
    setLoading(true);
    const url = `/api/data?feature=${encodeURIComponent(feature)}&range=${range}`;
    fetch(url)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [feature, range]);

  return { data, loading };
}

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/suggestions")
      .then((r) => r.json())
      .then(setSuggestions)
      .finally(() => setLoading(false));
  }, []);

  return { suggestions, loading };
}