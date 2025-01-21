import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import type { RuntimeConfig } from "nuxt/schema";
import type {
    APIResponse,
    LoginData,
    UserInfo,
    UserProfile,
} from "~/structure/type";

export const useAuthStore = defineStore("user", () => {
    const config: RuntimeConfig = useRuntimeConfig();

    const accessToken: Ref<string | null> = ref(null);
    const user: Ref<UserInfo | null> = ref(null);
    const userProfile: Ref<UserProfile | null> = ref(null);

    const login = async (item: LoginData) => {
        accessToken.value = item.accessToken;
        user.value = item.user;
        userProfile.value = item.userProfile;
    };

    const refreshAccessToken = async () => {
        try {
            const result: APIResponse<{
                accessToken: string;
                user: UserInfo;
                userProfile: UserProfile;
            }> = await $fetch("/auth/refresh", {
                baseURL: config.public.apiBase,
                method: "POST",
                credentials: "include", // 쿠키로 리프레시 토큰 전송
            });

            if (!result.success) {
                logout(); // 리프레시 토큰도 만료된 경우 로그아웃 처리
                ElMessage({
                    message: "세션이 만료되었습니다. 재 로그인 해주세요",
                    type: "error",
                });
                return;
            }

            accessToken.value = result.data.accessToken;
            user.value = result.data.user;
            userProfile.value = result.data.userProfile;
        } catch (error) {
            logout();
        }
    };

    const isAccessTokenExpired = (): boolean => {
        if (!accessToken.value) return true;

        const { exp }: { exp: number } = jwtDecode(accessToken.value); // 만료 시간 디코딩
        const now = Math.floor(Date.now() / 1000);

        return exp < now; // 만료 여부 반환
    };

    const ensureAccessToken = async () => {
        if (isAccessTokenExpired()) {
            await refreshAccessToken();
        }
    };

    const logout = async () => {
        try {
            await $fetch("/auth/logout", {
                baseURL: config.public.apiBase,
                method: "POST",
                credentials: "include",
            });
            // ElMessage({ message: "로그아웃 되었습니다.", type: "success" });
        } catch (error) {
            console.error("로그아웃 에러:", error);
        } finally {
            user.value = null;
            accessToken.value = null;
        }
    };

    const saveProfile = (item: UserProfile) => {
        userProfile.value = item;
    };

    return {
        accessToken,
        user,
        userProfile,
        login,
        refreshAccessToken,
        ensureAccessToken,
        logout,
        saveProfile,
    };
});
