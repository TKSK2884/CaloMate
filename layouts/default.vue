<template>
    <div>
        <header v-if="isHeader" class="secondary py-6">
            <div
                class="container mx-auto px-4 flex justify-between items-center"
            >
                <NuxtLink to="/">
                    <h1 class="text-2xl font-bold sm:text-3xl">CaloMate AI</h1>
                </NuxtLink>

                <div class="items-center space-x-5 hidden sm:flex">
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
                <div class="flex items-center block sm:hidden">
                    <UButton
                        @click="toggleMenu"
                        icon="i-heroicons-bars-4"
                        color="gray"
                        variant="ghost"
                    />
                </div>
            </div>
        </header>

        <!-- 오버레이 -->
        <div
            v-if="isMenuOpen"
            @click="toggleMenu()"
            class="fixed inset-0 bg-black z-10 opacity-50"
        />
        <div
            class="fixed inset-y-0 right-0 w-2/4 bg-white z-20 transform transition-transform duration-500 ease-in-out dark:bg-black"
            :class="isMenuOpen ? 'translate-x-0' : 'translate-x-full'"
        >
            <template v-if="isLogin()">
                <NuxtLink to="/profile">
                    <UButton
                        color="white"
                        variant="link"
                        class="w-full min-h-16 block"
                        >프로필</UButton
                    >
                </NuxtLink>
                <NuxtLink to="/ai">
                    <UButton
                        color="white"
                        variant="link"
                        class="w-full min-h-16 block"
                        >AI상담</UButton
                    >
                </NuxtLink>
                <NuxtLink to="/mypage">
                    <UButton
                        color="white"
                        variant="link"
                        class="w-full min-h-16 block"
                        >마이페이지</UButton
                    >
                </NuxtLink>
                <UButton
                    @click="logout"
                    color="white"
                    variant="link"
                    class="w-full min-h-16 block"
                    >로그아웃</UButton
                >
                <ThemeToggle
                    class="w-full min-h-16 flex justify-center item-center"
                />
            </template>
            <template v-else>
                <NuxtLink to="/login">
                    <UButton
                        color="white"
                        variant="link"
                        class="w-full min-h-16 block"
                        >로그인</UButton
                    >
                </NuxtLink>

                <NuxtLink to="/signup">
                    <UButton
                        color="white"
                        variant="link"
                        class="w-full min-h-16 block"
                    >
                        회원가입
                    </UButton>
                </NuxtLink>
                <ThemeToggle
                    class="w-full min-h-16 flex justify-center item-center"
                />
            </template>
        </div>

        <slot />
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const route = useRoute();

const pageTitle: Ref<string> = ref("");
const isHeader: Ref<boolean> = ref(true);
const isLoginMenu = ref(false);
const isMenuOpen = ref(false);

const authStore = useAuthStore();

const isLogin = (): boolean => {
    return authStore.accessToken != null;
};

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
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
