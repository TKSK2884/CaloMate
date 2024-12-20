<template>
    <UContainer class="mt-8">
        <UCard class="max-w-md mx-auto">
            <form @submit.prevent="saveProfile">
                <h2 class="text-2xl font-bold mb-6 text-center">
                    프로필 {{ isLogin() ? "수정" : "입력" }}
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
import type {
    APIResponse,
    ProfileFormData,
    SelectOption,
    UserProfile,
} from "~/structure/type";

const config: RuntimeConfig = useRuntimeConfig();

const authStore = useAuthStore();
const loadingStore = useLoadingStore();

definePageMeta({
    title: "프로필 설정",
});

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

onMounted(async () => {
    await checkProfile();
});

const isLogin = (): boolean => {
    return authStore.accessToken != null;
};

const checkProfile = async () => {
    try {
        const result: APIResponse<UserProfile | null> = await $fetch(
            "/profile/check",
            {
                baseURL: config.public.apiBase,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            }
        );

        if (result.data == null) {
            return;
        }

        const userProfile: UserProfile = result.data;

        formData.value.age = userProfile.age;
        if (userProfile.gender != "male") {
            formData.value.gender = 2;
        } else {
            formData.value.gender = 1;
        }

        formData.value.height = userProfile.height;
        formData.value.weight = userProfile.weight;

        const foundLevel: SelectOption | undefined = activityLevelOption.find(
            (level) => level.id == userProfile.activityLevel
        );

        if (foundLevel != undefined) {
            formData.value.activityLevel = foundLevel;
        }

        const foundTarget: SelectOption | undefined = targetOption.find(
            (target) => target.id == userProfile.target
        );

        if (foundTarget != undefined) {
            formData.value.target = foundTarget;
        }
    } catch (error) {}
};

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
            ElMessage({
                message: "프로필 설정중 오류발생 다시 시도해주세요",
                type: "error",
            });

            return;
        }

        if (result.message != null) {
            ElMessage({ message: result.message, type: "info" });
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

watch(
    () => loadingStore.appInitial,
    async (n) => {
        if (n) {
            await checkProfile();
        }
    }
);
</script>
