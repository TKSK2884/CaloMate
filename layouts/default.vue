<template>
    <div>
        <header v-if="isHeader" class="bg-white shadow py-4 top-0 z-50">
            <div
                class="container mx-auto max-w-screen-lg px-4 flex justify-between items-center"
            >
                <!-- 로고 -->
                <NuxtLink to="/" class="flex items-center space-x-2">
                    <h1 class="text-3xl font-black tracking-tight">
                        <span class="text-green-500">Calo</span>Mate<span
                            class="text-sm"
                        >
                            AI
                        </span>
                    </h1>
                </NuxtLink>

                <nav class="hidden sm:flex items-center space-x-6">
                    <template v-if="isLogin()">
                        <NuxtLink to="/profile" class="nav-link"
                            >프로필</NuxtLink
                        >
                        <NuxtLink to="/ai" class="nav-link"
                            >오늘의 식단</NuxtLink
                        >
                        <NuxtLink to="/mypage" class="nav-link"
                            >마이페이지</NuxtLink
                        >
                        <div @click="logout" class="nav-link cursor-pointer">
                            로그아웃
                        </div>
                    </template>

                    <template v-else>
                        <NuxtLink to="/login" class="nav-link">로그인</NuxtLink>
                        <NuxtLink to="/signup">
                            <UButton
                                class="bg-primary text-white hover:bg-primary/90"
                            >
                                회원가입
                            </UButton>
                        </NuxtLink>
                    </template>
                </nav>

                <div class="flex sm:hidden">
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
                        >오늘의 식단</UButton
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
