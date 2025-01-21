<template>
    <UContainer class="max-w-screen-lg">
        <h2 class="text-3xl font-bold my-6">AI 상담</h2>
        <UCard>
            <!-- 제목 -->
            <div class="text-2xl font-bold mb-4">CaloMate AI와 상담하기</div>

            <!-- 상담 입력폼 -->
            <template v-if="!loading && generateResult == null">
                <UTextarea
                    v-model="textArea"
                    class="mb-4"
                    placeholder="상담받을 내용을 입력해주세요"
                />
                <UButton
                    @click="sendText()"
                    :loading="loading"
                    class="bg-second text-primary-foreground hover:bg-second/90"
                >
                    전송
                </UButton>

                <div
                    v-if="authStore.accessToken != null"
                    class="mt-2 opacity-50"
                >
                    - 상담 내역은 마이페이지에서 확인할 수 있습니다.
                </div>

                <div v-else class="mt-2 opacity-50">
                    - 로그인시 상담 내역이 저장됩니다.
                </div>
            </template>

            <!-- 결과 -->
            <template v-if="!loading && generateResult != null">
                <div class="mb-8" v-html="generateResult" />
                <div class="flex gap-4 mb-8">
                    <UButton
                        @click="clearResult"
                        class="bg-second text-primary-foreground hover:bg-second/90"
                    >
                        다시하기
                    </UButton>
                    <UButton
                        v-if="!isLogin()"
                        @click="goLogin()"
                        class="bg-second text-primary-foreground hover:bg-second/90"
                    >
                        로그인하고 결과 저장하기
                    </UButton>
                </div>
            </template>

            <!-- 로딩 애니메이션 -->
            <div
                v-if="loading"
                class="flex items-center justify-center min-h-36"
            >
                <div
                    class="w-16 h-16 border-4 border-zinc-500 border-t-transparent rounded-full animate-spin"
                />
            </div>
        </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { convertReplacedText } from "~/utils/string";
import type { APIResponse } from "~/structure/type";

const config = useRuntimeConfig();
const route = useRoute();
const authStore = useAuthStore();

const loading: Ref<boolean> = ref(false);
const textArea: Ref<string> = ref("");
const token: Ref<string | null> = ref(null);
const generateResult: Ref<string | null> = ref(null);

onMounted(() => {
    if (route.query.token != null) {
        const queryToken = route.query.token;
        token.value = typeof queryToken === "string" ? queryToken : null;
    }

    if (authStore.userProfile == null && route.query.token == null) {
        ElMessage({
            message: "프로필을 먼저 입력해주세요",
            type: "warning",
        });

        navigateTo("/profile");
    }
});

onBeforeUnmount(() => {
    if (token.value != null) {
        sessionStorage.setItem("token", token.value);
    }
});

const isLogin = (): boolean => {
    return authStore.accessToken != null;
};

const sendText = async () => {
    if (textArea.value.trim() == "") {
        ElMessage({ message: "상담받을 내용을 입력해주세요", type: "warning" });
        return;
    }

    try {
        loading.value = true;
        const result: APIResponse<string> = await $fetch("/generate/support", {
            baseURL: config.public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
            body: {
                text: textArea.value,
                token: token.value,
            },
        });

        if (result.data != null) {
            generateResult.value = convertReplacedText(result.data);
        }
    } catch (error) {
        ElMessage({
            message: "상담 내용 생성중 에러가 발생했습니다. 다시 시도해주세요",
            type: "error",
        });
        return;
    } finally {
        loading.value = false;
    }
};

const clearResult = () => {
    textArea.value = "";
    generateResult.value = null;
};

const goLogin = () => {
    navigateTo({
        path: "/login",
    });
};
</script>
