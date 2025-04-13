import { useApiFetch } from "./useApiFetch";
import type { ConcertInfoResponse } from "~~/types/concertInfoTypes";
import type { ConcertRoundsResponse } from "~~/types/concertRoundsTypes";
import type { ConcertVariantsResponse } from "~~/types/concertVariantsTypes";
import type { ConcertVariantResponse } from "~~/types/concertVariantTypes";

const defaultParams = {
  currency: "myr",
  lang: "en",
};

export function useEventInfo(eventId: number) {
  return useApiFetch<ConcertInfoResponse>(`${eventId}`, {
    params: defaultParams,
  });
}

export function useEventStages(eventId: number) {
  return useApiFetch(`${eventId}/stages`);
}

export function useEventZones(eventId: number) {
  return useApiFetch(`${eventId}/zones`, {
    params: defaultParams,
  });
}

export function useEventStocks(eventId: number) {
  return useApiFetch(`${eventId}/stocks`, {
    params: defaultParams,
  });
}

export function useEventVariants(eventId: number) {
  return useApiFetch<ConcertVariantsResponse>(
    `${eventId}/variants`, {
      params: defaultParams,
    });
}
export function useEventRounds(eventId: number) {
  return useApiFetch<ConcertRoundsResponse>(
    `${eventId}/round`, {
      params: defaultParams,
    });
}

export function useVariantDetail(eventId: number, variantId: number) {
  return useApiFetch<ConcertVariantResponse>(
    `${eventId}/variants/${variantId}`, {
      params: defaultParams,
    });
}
