<template>
    <div />
</template>

<script setup lang="ts">
import { resultProps } from "element-plus";
import type { APIResponse, LoginData } from "~/structure/type";

const config = useRuntimeConfig();
const route = useRoute();

const authStore = useAuthStore();

onMounted(() => {
    if (route.query.code != null) {
        if (typeof route.query.code === "string") {
            tokenWithKakao(route.query.code);

            return;
        }
    }

    ElMessage({
        message: "카카오 로그인 에러 다시 시도해주세요",
        type: "error",
    });
});

const tokenWithKakao = async (code: string) => {
    try {
        const result: APIResponse<LoginData> = await $fetch("kakao/token", {
            baseURL: config.public.apiBase,
            method: "POST",
            body: {
                code: code,
            },
            credentials: "include",
        });

        window.opener.postMessage(
            { type: "LOGIN_SUCCESS", data: result.data },
            window.opener.origin
        );

        window.parent.close();
    } catch (error) {
        console.error(error);
    }
};
</script>
