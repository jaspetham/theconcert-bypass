import { useAuthStore } from "~~/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  if (!auth.token) {
    auth.setToken(config.authToken);
  }
});
