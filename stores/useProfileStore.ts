import { useUserProfile } from "~~/composables/useUserProfile";
import type { UserInterface } from "~~/types/userTypes";
export const useProfileStore = defineStore("profile", () => {
    const userData = ref<UserInterface | undefined>();

    const getUserData = computed(() => userData.value ? userData.value : null);

    async function setUserData(){
        console.log('setUserData')
        const { data } = await useUserProfile();
        userData.value = data.value?.response
    }

    return { userData, getUserData, setUserData }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfileStore, import.meta.hot));
}
