import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore("loading", () => {
    const globalLoading = ref(false);

    const loading = () => {
        globalLoading.value = true;
    };

    const loadingCompleted = () => {
        globalLoading.value = false;
    };

    return {
        globalLoading,
        loading,
        loadingCompleted,
    };
});
