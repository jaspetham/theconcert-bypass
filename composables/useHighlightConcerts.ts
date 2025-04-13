import type { ConcertResponse } from "~~/types/highlightConcertsTypes";

export function useHighlightConcerts() {
  return useAsyncData<ConcertResponse>(
    "Highlights Concerts",
    async () =>
      $fetch("https://cdn.theconcert.com/v3/concerts/en/highlight.json"),
    { lazy: true }
  );
}
