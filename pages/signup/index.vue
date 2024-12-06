<template>
    <UContainer class="mt-32">
        <form
            @submit.prevent="trySignup"
            class="max-w-md mx-auto bg-card p-8 rounded-lg shadow dark:shadow-white/10"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>

            <div class="mb-2">아이디</div>
            <UInput v-model="formData.id" required />

            <div class="my-2">비밀번호</div>
            <UInput v-model="formData.password" required />

            <div class="my-2">비밀번호 확인</div>
            <UInput v-model="confirmPassword" required />

            <div class="my-2">닉네임</div>
            <UInput v-model="formData.nickname" required />

            <UButton
                class="w-full bg-primary justify-center rounded-lg mt-4 text-primary-foreground hover:bg-primary/90 disabled:bg-primary"
                type="submit"
            >
                회원가입
            </UButton>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                이미 계정이 있으신가요?
                <NuxtLink to="/login" class="text-primary hover:underline">
                    로그인
                </NuxtLink>
            </p>
        </form>
    </UContainer>
</template>

<script setup lang="ts">
import type { RuntimeConfig } from "nuxt/schema";
import type { APIResponse, SignupFormData } from "~/structure/type";

const config: RuntimeConfig = useRuntimeConfig();

const confirmPassword: Ref<string> = ref("");
const loading: Ref<boolean> = ref(false);

const formData: Ref<SignupFormData> = ref({
    id: "",
    password: "",
    nickname: "",
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
    } catch {
    } finally {
        loading.value = false;
    }
};
</script>
