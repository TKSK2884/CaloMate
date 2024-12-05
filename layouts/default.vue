<template>
    <div>
        <header v-if="isHeader" class="secondary py-6">
            <div
                class="container mx-auto px-4 flex justify-between items-center"
            >
                <NuxtLink to="/">
                    <h1 class="text-3xl font-bold">CaloMate AI</h1>
                </NuxtLink>

                <div class="flex items-center space-x-4">
                    <NuxtLink to="/login" class="text-primary hover:underline">
                        로그인
                    </NuxtLink>

                    <NuxtLink to="/signup">
                        <UButton
                            class="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            회원가입
                        </UButton>
                    </NuxtLink>

                    <ThemeToggle />
                </div>
            </div>
        </header>

        <slot />
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

const pageTitle: Ref<string> = ref("");
const isHeader: Ref<boolean> = ref(true);
const isLoginMenu = ref(false);

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
