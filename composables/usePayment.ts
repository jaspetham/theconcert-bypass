// ~/composables/usePayment.ts
import { computed } from "vue";
import { useState } from "#app";
import { useApiFetch } from "./useApiFetch";
import type { cartPayload } from "~~/types/payloadTypes";

export function useAddCart(payload: cartPayload) {
  const key = `Cart-Add-${JSON.stringify(payload)}`; // Unique key for state

  // Reactive state
  const data = useState<any | null>(`${key}-data`, () => null);
  const pending = useState<boolean>(`${key}-pending`, () => false);
  const error = useState<any>(`${key}-error`, () => null);

  // POST request with useApiFetch
  const execute = async (): Promise<any> => {
    pending.value = true;
    error.value = null;
    try {
      const result = await useApiFetch(
        "cart-add",
        "https://api.theconcert.com/carts",
        {
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "application/json",
          },
        },
        false // Never fetch immediately
      ).execute();
      data.value = result;
      return result;
    } catch (err) {
      error.value = err;
      data.value = null;
      throw err;
    } finally {
      pending.value = false;
    }
  };

  return {
    data: computed(() => data.value),
    pending: computed(() => pending.value),
    error: computed(() => error.value),
    execute,
  };
}
