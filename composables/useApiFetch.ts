import { useAuthStore } from "~~/stores/auth";

export function useApiFetch<T = any>(
  path: string,
  options:any = {}
) {
  const auth = useAuthStore();
  const config = useRuntimeConfig();

  const isAbsolute = path.startsWith("http");
  const url = isAbsolute ? path : `${config.public.baseUrl}${path}`;

  const token = auth.token?.replace(/^Bearer\s/, "");

  return useFetch<T>(url, {
    ...options,
    baseURL: "", // force disable Nuxt default baseURL
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    params: options.params ?? {},
  });
}
