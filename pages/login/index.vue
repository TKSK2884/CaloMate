<template>
    <UContainer class="mt-16 sm:mt-32">
        <UCard class="max-w-md mx-auto bg-card p-8">
            <form @submit.prevent="tryLogin">
                <h2 class="text-2xl font-bold mb-6 text-center">로그인</h2>
                <p class="text-center text-sm text-muted-foreground mb-6">
                    다시 오신 걸 환영합니다! <br />
                    오늘도 건강한 하루를 CaloMate와 함께 시작해보세요.
                </p>
                <label class="block mb-1 font-medium">아이디</label>
                <UInput
                    v-model="formData.id"
                    required
                    icon="i-heroicons-user"
                />
                <label class="block mt-4 mb-1 font-medium">비밀번호</label>
                <UInput
                    v-model="formData.password"
                    required
                    type="password"
                    icon="i-heroicons-lock-closed"
                />
                <UButton
                    class="w-full bg-second justify-center rounded-lg mt-4 text-primary-foreground hover:bg-second/90 disabled:bg-second"
                    type="submit"
                    :loading="loading"
                >
                    로그인
                </UButton>

                <p class="my-4 text-center text-sm text-muted-foreground">
                    계정이 없으신가요?
                    <NuxtLink to="/signup" class="text-primary hover:underline">
                        회원가입
                    </NuxtLink>
                </p>
                <div @click="loginWithKakao" :class="$style.kakaoLogin" />
            </form>
        </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import type { APIResponse, LoginData, loginFormData } from "~/structure/type";

const config = useRuntimeConfig();
const authStore = useAuthStore();

const loading: Ref<boolean> = ref(false);
const token: Ref<string | null> = ref(null);

const formData: Ref<loginFormData> = ref({
    id: "",
    password: "",
});

const accessKey: string = config.public.kakaoAccessKey;
const redirectURI: string = config.public.kakaoRedirectURI;

onMounted(async () => {
    await authStore.ensureAccessToken();

    if (authStore.accessToken != null) {
        ElMessage({ message: "이미 로그인 되어있습니다.", type: "error" });
        navigateTo("/mypage");
    }

    // token.value = sessionStorage.getItem("token");

    window.addEventListener("message", messageHandler);
});

onBeforeUnmount(() => {
    window.removeEventListener("message", messageHandler);
});

const tryLogin = async () => {
    if (formData.value.id.trim() == "") {
        ElMessage({ message: "올바른 아이디를 입력해주세요", type: "warning" });
        return;
    }

    if (formData.value.password == "") {
        ElMessage({ message: "비밀번호를 입력해주세요", type: "warning" });
        return;
    }

    try {
        loading.value = true;

        const result: APIResponse<LoginData> = await $fetch("/auth/login", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: {
                ...formData.value,
                token: token.value,
            },
            credentials: "include",
        });

        authStore.login(result.data);

        // if (result.message != null) {
        //     ElMessage({
        //         message: result.message,
        //         type: "success",
        //     });
        // }

        ElMessage({ message: "로그인 성공", type: "success" });

        // if (token.value != null) {
        //     sessionStorage.clear();
        // }

        navigateTo("/mypage");
    } catch (error) {
        ElMessage({
            message: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
            type: "error",
        });
        console.error("로그인 에러:", error);
    } finally {
        loading.value = false;
    }
};

const loginWithKakao = () => {
    const url: string = `https://kauth.kakao.com/oauth/authorize?client_id=${accessKey}&redirect_uri=${redirectURI}&response_type=code`;

    window.open(url, "", "width=600, height=600");
};

const messageHandler = (event: MessageEvent) => {
    if (event.origin !== config.public.origin) return;

    const message = event.data;

    if (message.type === "LOGIN_SUCCESS") {
        authStore.login(message.data);

        ElMessage({ message: "로그인 성공", type: "success" });
        navigateTo("/mypage");
    }
};
</script>

<style lang="scss" module>
@use "@/assets/scss/utils.scss";

.kakaoLogin {
    margin-inline: auto;

    @include utils.kakaoButton;
}
</style>
