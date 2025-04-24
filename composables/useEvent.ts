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
  return useApiFetch<ConcertInfoResponse>("Info", `${eventId}`, {
    params: defaultParams,
    execute: false,
  });
}

export function useEventStages(eventId: number) {
  return useApiFetch("Stages", `${eventId}/stages`, {
    execute: false,
  });
}

export function useEventZones(eventId: number) {
  return useApiFetch("Zones", `${eventId}/zones`, {
    params: defaultParams,
    execute: false,
  });
}

export function useEventStocks(eventId: number) {
  const result = useApiFetch("Stocks", `${eventId}/stocks`, {
    params: defaultParams,
    execute: false,
  });
  return {
    ...result,
    fetch: result.execute, // Promise-based fetch
  };
}

export function useEventVariants(eventId: number) {
  const result = useApiFetch<ConcertVariantsResponse>(
    "Variants",
    `${eventId}/variants`,
    {
      params: defaultParams,
      execute: false,
    }
  );
  return {
    ...result,
    fetch: result.execute, // Promise-based fetch
  };
}
export function useEventRounds(eventId: number) {
  const result = useApiFetch<ConcertRoundsResponse>("Rounds", `${eventId}/round`, {
    params: defaultParams,
    execute: false,
  });
   return {
     ...result,
     fetch: result.execute, // Promise-based fetch
   };
}

export function useVariantDetail(eventId: number, variantId: number) {
  const result = useApiFetch<ConcertVariantResponse>(
    "Variant Details",
    `${eventId}/variants/${variantId}`,
    {
      params: defaultParams,
      execute: false,
    }
  );
  return {
    ...result,
    fetch: result.execute, // Promise-based fetch
  };
}
