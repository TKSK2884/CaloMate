<template>
    <UContainer class="max-w-screen-lg">
        <h2 class="text-3xl font-bold my-6">오늘의 식단 추천</h2>
        <UCard>
            <!-- 제목 -->
            <div class="text-2xl font-bold mb-4">
                CaloMate AI 에게 추천 받기
            </div>

            <!-- 상담 입력폼 -->
            <template
                v-if="!loading && resultDiet == null && resultWorkout == null"
            >
                <!-- 현재 프로필 정보 -->
                <template v-if="userProfile != null">
                    <div class="text-xl font-semibold mb-2">
                        현재 프로필 정보
                    </div>

                    <ul class="text-sm space-y-1 mb-4">
                        <li>나이: {{ userProfile.age }}</li>
                        <li>
                            성별:
                            {{ getGenderText() }}
                        </li>
                        <li>키: {{ userProfile.height }} cm</li>
                        <li>몸무게: {{ userProfile.weight }} kg</li>
                        <li>활동 수준: {{ getActivityText() }}</li>
                        <li>목표: {{ getTargetText() }}</li>
                    </ul>
                </template>

                <UButton
                    @click="getResult()"
                    :loading="loading"
                    class="bg-second text-primary-foreground hover:bg-second/90"
                >
                    추천 받기
                </UButton>

                <div
                    v-if="authStore.accessToken != null"
                    class="mt-2 opacity-50"
                >
                    - 추천 내역은 마이페이지에서 확인할 수 있습니다.
                </div>

                <div v-else class="mt-2 opacity-50">
                    - 로그인시 상담 내역이 저장됩니다.
                </div>
            </template>

            <!-- 결과 -->
            <template
                v-if="!loading && resultDiet != null && resultWorkout != null"
            >
                <!-- 식단 추천 -->
                <div class="mb-6">
                    <div class="text-xl font-semibold mb-4">
                        🍽 오늘의 식단 추천
                    </div>

                    <div class="grid gap-4 md:grid-cols-3">
                        <div
                            v-for="(item, index) in resultDiet"
                            :key="'result-' + index"
                            :class="[
                                'border border-gray-200 rounded-xl p-4 shadow-sm',
                                item.checked ? 'bg-green-50' : 'bg-white',
                            ]"
                        >
                            <div class="font-bold text-gray-700 text-base mb-2">
                                {{ item.meal }}
                            </div>
                            <ul class="text-sm text-gray-700 space-y-1">
                                <li>칼로리: {{ item.calories }} kcal</li>
                                <li>탄수화물: {{ item.carbs }}g</li>
                                <li>단백질: {{ item.protein }}g</li>
                                <li>지방: {{ item.fat }}g</li>
                            </ul>
                            <UCheckbox
                                v-if="isLogin()"
                                v-model="item.checked"
                                @change="onDietCheck(item, index)"
                                class="mt-2"
                            />
                        </div>
                    </div>
                </div>

                <!-- 운동 추천 -->
                <div class="mb-8">
                    <div class="text-xl font-semibold mb-4">
                        💪 오늘의 운동 추천
                    </div>
                    <ul
                        class="list-disc pl-6 text-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                    >
                        <li
                            v-for="(workout, idx) in resultWorkout"
                            :key="'workout-' + idx"
                        >
                            {{ workout }}
                        </li>
                    </ul>
                </div>
                <div class="flex gap-4 mb-8">
                    <!-- <UButton
                        class="bg-second text-primary-foreground hover:bg-second/90"
                    >
                        저장하기
                    </UButton> -->
                    <UButton
                        @click="clearResult"
                        class="bg-second text-primary-foreground hover:bg-second/90"
                    >
                        다시하기
                    </UButton>

                    <UButton
                        v-if="!isLogin()"
                        @click="goLogin()"
                        class="bg-second text-primary-foreground hover:bg-second/90"
                    >
                        로그인하고 결과 저장하기
                    </UButton>
                </div>
            </template>

            <!-- 로딩 애니메이션 -->
            <div
                v-if="loading"
                class="flex items-center justify-center min-h-36"
            >
                <div
                    class="w-16 h-16 border-4 border-zinc-500 border-t-transparent rounded-full animate-spin"
                />
            </div>
        </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import type {
    AIResponse,
    APIResponse,
    Meal,
    UserProfile,
} from "~/structure/type";

const config = useRuntimeConfig();
const route = useRoute();
const authStore = useAuthStore();

const loading: Ref<boolean> = ref(false);
const token: Ref<string | null> = ref(null);
// const generateResult: Ref<AIResponse | null> = ref(null);
const resultDiet: Ref<Meal[] | null> = ref(null);
const resultWorkout: Ref<string[] | null> = ref(null);

const userProfile: Ref<UserProfile | null> = ref(null);
const checkedItems = ref<boolean[]>([]);
const resultId: Ref<number | null> = ref(null);

const getGenderText = (): string => {
    if (userProfile.value == null) return "";

    const map = {
        male: "남성",
        female: "여성",
    };

    return (
        map[userProfile.value.gender as keyof typeof map] ??
        userProfile.value.gender
    );
};

const getActivityText = (): string => {
    if (userProfile.value == null) return "";

    const map = {
        sedentary: "거의 운동하지 않음",
        light: "가벼운 운동",
        moderate: "중간 수준 운동",
        active: "활발한 운동",
        very_active: "매우 활발한 운동",
    };

    return (
        map[userProfile.value.activityLevel as keyof typeof map] ??
        userProfile.value.activityLevel
    );
};

const getTargetText = (): string => {
    if (userProfile.value == null) return "";

    const map = {
        lose_weight: "체중 감량",
        maintain: "체중 유지",
        gain_muscle: "근육 증가",
    };

    return (
        map[userProfile.value.target as keyof typeof map] ??
        userProfile.value.target
    );
};

const onDietCheck = async (item: Meal, index: number) => {
    await $fetch("/diet/log", {
        baseURL: config.public.apiBase,
        method: "POST",
        headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: {
            meal: item.meal,
            date: new Date().toISOString().split("T")[0],
            checked: item.checked,
        },
    });

    console.log("저장 완료");
};

onMounted(() => {
    if (route.query.token != null) {
        const queryToken = route.query.token;
        token.value = typeof queryToken === "string" ? queryToken : null;
    }

    if (authStore.userProfile == null && route.query.token == null) {
        ElMessage({
            message: "프로필을 먼저 입력해주세요",
            type: "warning",
        });

        navigateTo("/profile");
    }

    if (route.query.token != null) {
        getProfileByToken();
        return;
    }

    if (authStore.userProfile != null) {
        userProfile.value = authStore.userProfile;

        getUserDiet();
    }
});

onBeforeUnmount(() => {
    if (token.value != null) {
        sessionStorage.setItem("token", token.value);
    }
});

const isLogin = (): boolean => {
    return authStore.accessToken != null;
};

const sendText = async () => {
    if (textArea.value.trim() == "") {
        ElMessage({ message: "상담받을 내용을 입력해주세요", type: "warning" });
        return;
    }

    try {
        loading.value = true;
        const result: APIResponse<string> = await $fetch("/generate/support", {
            baseURL: config.public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
            body: {
                text: textArea.value,
                token: token.value,
            },
        });

        if (result.data != null) {
            generateResult.value = convertReplacedText(result.data);
        }
    } catch (error) {
        ElMessage({
            message: "상담 내용 생성중 에러가 발생했습니다. 다시 시도해주세요",
            type: "error",
        });
        return;
    } finally {
        loading.value = false;
    }
};

const clearResult = () => {
    textArea.value = "";
    generateResult.value = null;
};

const goLogin = () => {
    navigateTo({
        path: "/login",
    });
};
</script>
