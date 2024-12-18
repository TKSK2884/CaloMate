<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>

        <div
            v-if="loading"
            class="fixed inset-0 flex items-center justify-center min-h-screen bg-white"
        >
            <div
                class="w-16 h-16 border-4 border-zinc-500 border-t-transparent rounded-full animate-spin"
            />
        </div>
    </div>
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
