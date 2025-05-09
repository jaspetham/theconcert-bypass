import { useAuthStore } from "~~/stores/auth";
import { useProfileStore } from "~~/stores/useProfileStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
    const profileStore = useProfileStore();


  if (!auth.token) {
    auth.setToken(config.authToken);
  } else if (profileStore.userData === null || profileStore.userData === undefined) {
    profileStore.setUserData();
  }
});
