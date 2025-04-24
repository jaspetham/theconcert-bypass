// useApiFetch.ts
import { ref, computed } from "vue";
import { useAuthStore } from "~~/stores/auth";
import { useState } from "#app";

export function useApiFetch<T = any>(
  apiName: string,
  path: string,
  options: any = {}
) {
  const auth = useAuthStore();
  const config = useRuntimeConfig();

  const isAbsolute = path.startsWith("http");
  const url = isAbsolute ? path : `${config.public.baseUrl}${path}`;
  const token = auth.token?.replace(/^Bearer\s/, "");

  const key = `Event-${apiName}-${path}`; // Unique key for state

  // Reactive state using useState for component-shared state
  const data = useState<T | null>(`${key}-data`, () => null);
  const pending = useState<boolean>(`${key}-pending`, () => false);
  const error = useState<any>(`${key}-error`, () => null);

  // Fetch function
  const execute = async () => {
    pending.value = true;
    error.value = null;
    try {
      data.value = await $fetch<T>(url, {
        headers: {
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: options.params ?? {},
      });
    } catch (err) {
      error.value = err;
      data.value = null;
    } finally {
      pending.value = false;
    }
  };

  // Execute immediately (client-side only)
  if (process.client) {
    execute();
  }

  // Refresh function to re-fetch data
  const refresh = () => execute();

  return {
    data: computed(() => data.value),
    pending: computed(() => pending.value),
    error: computed(() => error.value),
    refresh,
  };
}
