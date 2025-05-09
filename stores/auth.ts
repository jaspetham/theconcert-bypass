export const useAuthStore = defineStore('auth', () => {
    const token = useCookie<string | null>('auth_token', {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: true,
        secure: true,
        httpOnly: false
    })

    function setToken(newToken:string){
        token.value = newToken
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