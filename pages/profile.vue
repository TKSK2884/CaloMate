<template>
    <UContainer class="mt-8">
        <UCard class="max-w-md mx-auto">
            <form @submit.prevent="saveProfile">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    프로필 입력
                </h2>
                <div class="mb-2">나이</div>
                <UInput v-model="formData.age" type="number" />
                <div class="my-2">성별</div>
                <URadioGroup
                    v-model="formData.gender"
                    :ui="{ fieldset: 'flex gap-4' }"
                    :options="genderOptions"
                />
                <div class="my-2">키(cm)</div>
                <UInput v-model="formData.height" type="number" />
                <div class="my-2">몸무게(kg)</div>
                <UInput v-model="formData.weight" type="number" />
                <div class="my-2">활동 수준</div>
                <USelectMenu
                    v-model="formData.activityLevel"
                    :options="activityLevelOption"
                />
                <div class="my-2">목표</div>
                <USelectMenu
                    v-model="formData.target"
                    :options="targetOption"
                />
                <UButton
                    class="w-full bg-primary justify-center rounded-lg mt-4 text-primary-foreground hover:bg-primary/90"
                    type="submit"
                >
                    프로필 저장
                </UButton>
            </form>
        </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import type { RuntimeConfig } from "nuxt/schema";
import type { APIResponse, ProfileFormData } from "~/structure/type";

const authStore = useAuthStore();

definePageMeta({
    title: "프로필 설정",
});

const config: RuntimeConfig = useRuntimeConfig();

const formData: Ref<ProfileFormData> = ref({
    age: 20,
    gender: 0,
    height: 170,
    weight: 50,
    activityLevel: {},
    target: {},
});

const genderOptions = [
    {
        value: 1,
        label: "남성",
    },
    {
        value: 2,
        label: "여성",
    },
];

const activityLevelOption = [
    { id: "sedentary", label: "거의 운동하지 않음" },
    { id: "light", label: "가벼운 운동 (주 1-3회)" },
    { id: "moderate", label: "중간 수준 운동 (주 3-5회)" },
    { id: "active", label: "활발한 운동 (주 6-7회)" },
    { id: "very_active", label: "매우 활발한 운동 (하루 2회 이상)" },
];

const targetOption = [
    { id: "lose_weight", label: "체중 감량" },
    { id: "maintain", label: "체중 유지" },
    { id: "gain_muscle", label: "근육 증가" },
];

const saveProfile = async () => {
    if (formData.value == null) return;

    if (formData.value.age == null || formData.value.age < 1) {
        ElMessage({ message: "올바른 나이를 입력해주세요", type: "warning" });
        return;
    }

    if (formData.value.gender == 0) {
        ElMessage({ message: "성별을 선택해주세요", type: "warning" });
        return;
    }

    if (formData.value.height == null || formData.value.height < 1) {
        ElMessage({ message: "올바른 키를 입력해주세요", type: "warning" });
        return;
    }

    if (formData.value.weight == null || formData.value.weight < 1) {
        ElMessage({ message: "올바른 체중을 입력해주세요", type: "warning" });
        return;
    }

    if (
        formData.value.activityLevel == null ||
        JSON.stringify(formData.value.activityLevel) === "{}"
    ) {
        ElMessage({ message: "활동수준을 선택해주세요", type: "warning" });
        return;
    }

    if (
        formData.value.target == null ||
        JSON.stringify(formData.value.target) === "{}"
    ) {
        ElMessage({ message: "목표를 선택해주세요", type: "warning" });
        return;
    }

    try {
        const result: APIResponse<{ profileToken: string } | null> =
            await $fetch("/profile/save", {
                baseURL: config.public.apiBase,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`, // 사용자 인증 정보
                },
                body: formData.value,
            });

        if (!result.success) {
            return;
        }

        if (result.message != null) {
            ElMessage({ message: result.message, type: "warning" });
            return;
        }

        if (result.data?.profileToken) {
            navigateTo({
                path: "/ai",
                query: {
                    token: result.data.profileToken,
                },
            });

            return;
        }

        navigateTo("/ai");
    } catch (error) {
        ElMessage({
            message: "프로필 등록에 실패하였습니다. 다시 시도해주세요",
            type: "error",
        });
        return;
    }
};
</script>
