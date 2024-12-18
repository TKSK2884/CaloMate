<template>
    <div>
        <header v-if="isHeader" class="secondary py-6">
            <div
                class="container mx-auto px-4 flex justify-between items-center"
            >
                <NuxtLink v-if="isLogin()" to="/mypage">
                    <h1 class="text-3xl font-bold">CaloMate AI</h1>
                </NuxtLink>

                <NuxtLink v-else to="/">
                    <h1 class="text-3xl font-bold">CaloMate AI</h1>
                </NuxtLink>

                <div class="flex items-center space-x-5">
                    <template v-if="isLogin()">
                        <NuxtLink
                            to="/profile"
                            class="text-primary hover:underline"
                        >
                            프로필
                        </NuxtLink>
                        <NuxtLink to="/ai" class="text-primary hover:underline">
                            AI 상담
                        </NuxtLink>
                        <NuxtLink
                            to="/mypage"
                            class="text-primary hover:underline"
                        >
                            마이페이지
                        </NuxtLink>
                        <div
                            @click="logout"
                            class="text-primary hover:underline cursor-pointer"
                        >
                            로그아웃
                        </div>
                    </template>

                    <template v-else>
                        <NuxtLink
                            to="/login"
                            class="text-primary hover:underline"
                        >
                            로그인
                        </NuxtLink>

                        <NuxtLink to="/signup">
                            <UButton
                                class="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                회원가입
                            </UButton>
                        </NuxtLink>
                    </template>

                    <ThemeToggle />
                </div>
            </div>
        </header>

        <slot />
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
// import { useLoadingStore } from "~/stores/loading";

const route = useRoute();

const pageTitle: Ref<string> = ref("");
const isHeader: Ref<boolean> = ref(true);
const isLoginMenu = ref(false);

const authStore = useAuthStore();
const loadingStore = useLoadingStore();

// onMounted(async () => {
//     try {
//         loadingStore.loading();
//         await authStore.restoreAuthState();
//     } catch (error) {
//         return;
//     } finally {
//         loadingStore.loadingCompleted();
//     }
// });

const isLogin = (): boolean => {
    return authStore.accessToken != null;
};

const logout = () => {
    authStore.logout();
    navigateTo("/");
};

watch(
    () => route.meta.layoutStyle,
    (n) => {
        if (typeof n == "string") {
            if (n == "home") {
                isLoginMenu.value = true;
            } else {
                isLoginMenu.value = false;
            }

            if (n == "none") {
                isHeader.value = false;
            }
        } else {
            isHeader.value = true;
            isLoginMenu.value = false;
        }
    },
    { immediate: true }
);

watch(
    () => route.meta.title,
    (n) => {
        if (typeof n == "string") {
            pageTitle.value = n;
        }
    },
    { immediate: true }
);
</script>
