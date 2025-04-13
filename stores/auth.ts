import { useProfileStore } from "./useProfileStore";

export const useAuthStore = defineStore('auth', () => {
    const token = useCookie<string | null>('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: true,
        secure: true,
        httpOnly: false
    })

    function setToken(newToken:string){
        console.log('wtf')
        token.value = newToken
        const profileStore = useProfileStore();
        console.log('setToken' , profileStore)
        profileStore.setUserData();
    }

    function clearToken(){
        token.value = null
    }

    return {
        token,
        setToken,
        clearToken
    }
})

if(import.meta.hot){
    import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}