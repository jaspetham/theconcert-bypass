import { useAuthStore } from "~~/stores/auth";

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
  return useAsyncData<T>(
    `Event ${apiName}`,
    async () => {
      return await $fetch<T>(url, {
        headers: {
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: options.params ?? {},
      });
    },
    { lazy: true }
  );
}
