<template>
    <UContainer class="mt-32">
        <form
            @submit.prevent="tryLogin"
            class="max-w-md mx-auto bg-card p-8 rounded-lg shadow dark:shadow-white/10"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

            <div class="mb-2">아이디</div>
            <UInput v-model="formData.id" required />
            <div class="my-2">비밀번호</div>
            <UInput v-model="formData.password" required />

            <UButton
                class="w-full bg-primary justify-center rounded-lg mt-4 text-primary-foreground hover:bg-primary/90"
                type="submit"
            >
                로그인
            </UButton>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                계정이 없으신가요?
                <NuxtLink to="/signup" class="text-primary hover:underline">
                    회원가입
                </NuxtLink>
            </p>
        </form>
    </UContainer>
</template>

<script setup lang="ts">
import type { RuntimeConfig } from "nuxt/schema";
import type { APIResponse, loginFormData } from "~/structure/type";

const config: RuntimeConfig = useRuntimeConfig();

const formData: Ref<loginFormData> = ref({
    id: "",
    password: "",
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
        const result: APIResponse<null> = await $fetch("/auth/login", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: formData.value,
        });

        if (!result.success) {
            return ElMessage({
                message: "로그인에 실패하였습니다.",
                type: "error",
            });
        }

        ElMessage({ message: "로그인 성공", type: "success" });
        navigateTo("/dashboard");
    } catch {}
};
</script>
