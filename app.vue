<template>
    <NuxtLayout>
        <template v-if="!loading">
            <NuxtPage />
        </template>
        <template v-else>
            <div
                class="fixed inset-0 flex items-center justify-center min-h-screen bg-white dark:bg-black"
            >
                <div
                    class="w-16 h-16 border-4 border-zinc-500 border-t-transparent rounded-full animate-spin"
                />
            </div>
        </template>
    </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const loadingStore = useLoadingStore();
const initial: Ref<boolean> = ref(false);
const loading: Ref<boolean> = ref(true);

onMounted(async () => {
    try {
        await authStore.refreshAccessToken();
    } catch (error) {
        console.error("인증 상태 복원 중 오류 발생:", error);
    } finally {
        loading.value = false;
        initial.value = true;

        loadingStore.appInitial = initial.value;
    }
});
</script>
