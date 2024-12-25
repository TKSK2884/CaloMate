<template>
    <UContainer class="mt-16 sm:mt-32">
        <UCard class="max-w-md mx-auto bg-card p-8">
            <form @submit.prevent="trySignup">
                <h2 class="text-2xl font-bold mb-6 text-center">회원가입</h2>

                <div class="mb-2">아이디</div>
                <UInput v-model="formData.id" required />

                <div class="my-2">비밀번호</div>
                <UInput v-model="formData.password" required />

                <div class="my-2">비밀번호 확인</div>
                <UInput v-model="confirmPassword" required />

                <div class="my-2">닉네임</div>
                <UInput v-model="formData.nickname" required />

                <UButton
                    class="w-full bg-second justify-center rounded-lg mt-4 text-primary-foreground hover:bg-second/90 disabled:bg-second"
                    type="submit"
                    :loading="loading"
                >
                    회원가입
                </UButton>

                <p class="my-4 text-center text-sm text-muted-foreground">
                    이미 계정이 있으신가요?
                    <NuxtLink to="/login" class="text-primary hover:underline">
                        로그인
                    </NuxtLink>
                </p>
                <div @click="loginWithKakao" :class="$style.kakaoLogin" />
            </form>
        </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import type { RuntimeConfig } from "nuxt/schema";
import type { APIResponse, SignupFormData } from "~/structure/type";

const config: RuntimeConfig = useRuntimeConfig();
const authStore = useAuthStore();

const confirmPassword: Ref<string> = ref("");
const loading: Ref<boolean> = ref(false);

const formData: Ref<SignupFormData> = ref({
    id: "",
    password: "",
    nickname: "",
});

const accessKey: string = config.public.kakaoAccessKey;
const redirectURI: string = config.public.kakaoRedirectURI;

onBeforeMount(async () => {
    await authStore.ensureAccessToken();

    if (authStore.accessToken != null) {
        ElMessage({ message: "이미 로그인 되어있습니다.", type: "error" });
        navigateTo("/profile");
    }
});

onMounted(() => {
    window.addEventListener("message", messageHandler);
});

onBeforeUnmount(() => {
    window.removeEventListener("message", messageHandler);
});

const trySignup = async () => {
    if (formData.value.id.trim() == "") {
        ElMessage({ message: "올바른 아이디를 입력해주세요", type: "warning" });
        return;
    }

    if (formData.value.password == "") {
        ElMessage({ message: "비밀번호를 입력해주세요", type: "warning" });
        return;
    }

    if (formData.value.password != confirmPassword.value) {
        ElMessage({
            message: "비밀번호가 비밀번호 확인과 일치하지않습니다..",
            type: "warning",
        });
        return;
    }

    if (formData.value.nickname.trim() == "") {
        ElMessage({
            message: "닉네임을 입력해주세요",
            type: "warning",
        });
        return;
    }

    try {
        loading.value = true;

        const result: APIResponse<null> = await $fetch("/auth/signup", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: formData.value,
        });

        if (!result.success) return;

        ElMessage({ message: "회원가입에 성공했습니다.", type: "success" });
        navigateTo("/login");
    } catch (error) {
        ElMessage({
            message: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
            type: "error",
        });
        console.error("회원가입 에러:", error);
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
        navigateTo("/profile");
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
