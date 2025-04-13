import { useAuthStore } from "~~/stores/auth";
import type { UserProfileReponse } from "~~/types/userTypes";

export function useUserProfile() {
  const auth = useAuthStore();
  return useAsyncData<UserProfileReponse>(
    "Profile",
    () =>
      $fetch("https://www.theconcert.com/rest/users/profile", {
        headers: auth.token ? { token: auth.token } : {},
        params: {
          currency: "thb",
          lang: "en",
        },
      })
  );
}
