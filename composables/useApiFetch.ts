import { ref, computed } from "vue";
import { useAuthStore } from "~~/stores/auth";
import { useState } from "#app";

export function useApiFetch<T = any>(
  apiName: string,
  path: string,
  options: any = {},
  execute: boolean = true // New option to control immediate execution
) {
  const auth = useAuthStore();
  const config = useRuntimeConfig();

  const isAbsolute = path.startsWith("http");
  const url = isAbsolute ? path : `${config.public.baseUrl}${path}`;
  const token = auth.token?.replace(/^Bearer\s/, "");

  const key = `Event-${apiName}-${path}`; // Unique key for state

  // Reactive state using useState
  const data = useState<T | null>(`${key}-data`, () => null);
  const pending = useState<boolean>(`${key}-pending`, () => false);
  const error = useState<any>(`${key}-error`, () => null);

  // Fetch function returning a Promise
  const fetchData = async (): Promise<T> => {
    pending.value = true;
    error.value = null;
    try {
      const result = await $fetch<T>(url, {
        method: options.method || "GET",
        body: options.body ? JSON.stringify(options.body) : undefined,
        headers: {
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: options.params ?? {},
      });
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

  // Execute immediately if execute is true (client-side only)
  if (process.client && execute) {
    fetchData();
  }

  // Refresh function to re-fetch data
  const refresh = () => fetchData();

  return {
    data: computed(() => data.value),
    pending: computed(() => pending.value),
    error: computed(() => error.value),
    refresh,
    execute: fetchData, // Expose Promise-based fetch
  };
}
