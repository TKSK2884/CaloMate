<template>
    <UContainer class="mt-32">
        <UCard class="max-w-md mx-auto bg-card p-8">
            <form @submit.prevent="tryLogin">
                <h2 class="text-2xl font-bold mb-6 text-center">로그인</h2>

                <div class="mb-2">아이디</div>
                <UInput v-model="formData.id" required />
                <div class="my-2">비밀번호</div>
                <UInput v-model="formData.password" required />

                <UButton
                    class="w-full bg-primary justify-center rounded-lg mt-4 text-primary-foreground hover:bg-primary/90 disabled:bg-primary"
                    type="submit"
                    :loading="loading"
                >
                    로그인
                </UButton>

                <p class="mt-4 text-center text-sm text-muted-foreground">
                    계정이 없으신가요?
                    <NuxtLink to="/signup" class="text-primary hover:underline">
                        회원가입
                    </NuxtLink>
                </p>
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

onBeforeMount(async () => {
    await authStore.ensureAccessToken();

    if (authStore.accessToken != null) {
        ElMessage({ message: "이미 로그인 되어있습니다.", type: "error" });
        navigateTo("/profile");
    }
});

onMounted(() => {
    token.value = sessionStorage.getItem("token");
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

        if (result.message != null) {
            ElMessage({
                message: result.message,
                type: "success",
            });
        }

        ElMessage({ message: "로그인 성공", type: "success" });

        if (token.value != null) {
            sessionStorage.clear();
        }

        navigateTo("/profile");
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
</script>
