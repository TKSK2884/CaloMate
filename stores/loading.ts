import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore("loading", () => {
    const globalLoading: Ref<boolean> = ref(false);
    const appInitial: Ref<boolean> = ref(false);

    const loading = () => {
        globalLoading.value = true;
    };

    const loadingCompleted = () => {
        globalLoading.value = false;
    };

    return {
        globalLoading,
        appInitial,
        loading,
        loadingCompleted,
    };
});
