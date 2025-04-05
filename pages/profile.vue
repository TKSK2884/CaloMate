<template>
    <UContainer class="mt-8">
        <UCard class="max-w-md mx-auto">
            <form @submit.prevent="saveProfile">
                <h2 class="text-2xl font-bold mb-2 text-center">
                    내 프로필 정보 {{ isProfile() ? "수정하기" : "입력하기" }}
                </h2>
                <p class="text-sm text-muted-foreground text-center mb-6">
                    AI가 식단과 운동을 추천하기 위해 필요한 정보를 입력해주세요.
                </p>
                <label class="block mb-1 font-medium text-sm text-gray-700"
                    >나이</label
                >
                <UInput
                    v-model="formData.age"
                    type="number"
                    placeholder="예: 28"
                />
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

                <div
                    v-if="bmi"
                    class="mt-2 text-sm rounded bg-gray-50 border border-gray-200 py-2 px-3 text-center text-gray-600"
                >
                    💡 현재 BMI는
                    <span class="font-bold text-gray-900">{{ bmi }}</span
                    >이며,
                    <span class="text-primary font-semibold">{{
                        bmiComment
                    }}</span
                    >입니다.
                </div>

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
                    :loading="loading"
                    icon="i-heroicons-check-circle"
                    class="w-full bg-second mt-6 justify-center"
                    type="submit"
                >
                    프로필 저장하고 AI 추천 받기
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

const loading: Ref<boolean> = ref(false);

const formData: Ref<ProfileFormData> = ref({
    age: 20,
    gender: 0,
    height: 170,
    weight: 60,
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

const bmi = computed(() => {
    const height = formData.value.height;
    const weight = formData.value.weight;

    if (!height || !weight) return null;

    const meter: number = height / 100;
    const value: number = weight / (meter * meter);

    return value.toFixed(1); // 소수점 한 자리
});

const bmiComment = computed(() => {
    if (bmi.value == null) return "";

    const value: number = parseFloat(bmi.value);

    if (value < 18.5) return "저체중";
    if (value < 23) return "정상 체중";
    if (value < 25) return "과체중";
    return "비만";
});

onMounted(async () => {
    await checkProfile();
});

const isProfile = (): boolean => {
    return authStore.userProfile != null;
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
        loading.value = true;

        const result: APIResponse<{ profileToken: string } | null> =
            await $fetch("/profile/save", {
                baseURL: config.public.apiBase,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`, // 사용자 인증 정보
                },
                body: formData.value,
            });

        loading.value = false;

        if (!result.success) {
            ElMessage({
                message:
                    "프로필 설정 중 오류가 발생했습니다. 다시 시도해주세요.",
                type: "error",
            });

            return;
        }

        ElMessage({ message: "프로필 설정 완료", type: "success" });

        if (result.data?.profileToken) {
            navigateTo({
                path: "/ai",
                query: {
                    token: result.data.profileToken,
                },
            });

            return;
        }

        // 프로필 등록
        if (
            !(
                "id" in formData.value.activityLevel &&
                "id" in formData.value.target
            )
        ) {
            return;
        }

        let userGender: string = "male";

        if (formData.value.gender != 1) {
            userGender = "female";
        }

        const convertedProfile: UserProfile = {
            age: formData.value.age,
            gender: userGender,
            height: formData.value.height,
            weight: formData.value.weight,
            activityLevel: formData.value.activityLevel.id,
            target: formData.value.target.id,
        };

        authStore.saveProfile(convertedProfile);

        navigateTo("/ai");
    } catch (error) {
        loading.value = false;

        ElMessage({
            message: "프로필 등록에 실패하였습니다. 다시 시도해주세요",
            type: "error",
        });
        return;
    }
};
</script>
