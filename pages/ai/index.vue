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
                                🍱 {{ item.meal }}
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
                            💪 {{ workout }}
                        </li>
                    </ul>
                </div>
                <div class="flex gap-4 mb-8">
                    <UButton
                        @click="clearResult"
                        class="bg-second text-primary-foreground hover:bg-second/90"
                    >
                        다시하기
                    </UButton>
                </div>
            </template>

            <!-- <div v-if="!loading && resultDiet != null" class="mb-12">
                <div class="text-xl font-semibold mb-4">
                    📊 영양소 구성 비율
                </div>
                <div class="w-full md:w-96 mx-auto">
                    <div ref="chartRef" class="w-full h-[300px]" />
                </div>
            </div> -->

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
    Nutrition,
    UserProfile,
} from "~/structure/type";

const config = useRuntimeConfig();
const route = useRoute();
const authStore = useAuthStore();

const loading: Ref<boolean> = ref(false);
const token: Ref<string | null> = ref(null);

// const { $echarts } = useNuxtApp();

const resultDiet: Ref<Meal[] | null> = ref(null);
const resultWorkout: Ref<string[] | null> = ref(null);

const userProfile: Ref<UserProfile | null> = ref(null);
const checkedItems = ref<boolean[]>([]);
const resultId: Ref<number | null> = ref(null);

const chartRef: Ref<HTMLDivElement | null> = ref(null);

// const totalNutrition = computed((): Nutrition => {
//     if (resultDiet.value == null) return { carbs: 0, protein: 0, fat: 0 };

//     return resultDiet.value.reduce(
//         (acc: Nutrition, item: Meal) => {
//             acc.carbs += item.carbs;
//             acc.protein += item.protein;
//             acc.fat += item.fat;
//             return acc;
//         },
//         { carbs: 0, protein: 0, fat: 0 }
//     );
// });

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

    ElMessage({
        message: item.checked
            ? "식단 완료로 체크했습니다."
            : "체크를 취소했습니다.",
        type: "info",
    });
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

const isLogin = (): boolean => {
    return authStore.accessToken != null;
};

const getProfileByToken = async () => {
    try {
        loading.value = true;
        const result: APIResponse<UserProfile> = await $fetch(
            "/profile/token",
            {
                baseURL: config.public.apiBase,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
                query: {
                    token: token.value,
                },
            }
        );

        userProfile.value = result.data;
    } catch (error) {
        ElMessage({
            message: "프로필 로드중 에러가 발생. 다시 시도해주세요",
            type: "error",
        });
    } finally {
        loading.value = false;
    }
};

const getUserDiet = async () => {
    try {
        loading.value = true;

        const result: APIResponse<{
            diet: Meal[];
            workout: string[];
            resultId: number | null;
        }> = await $fetch("/diet/check", {
            baseURL: config.public.apiBase,
            method: "GET",
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
        });

        if (result.data != null) {
            resultDiet.value = result.data.diet;
            resultWorkout.value = result.data.workout;

            if (result.data.resultId != null) {
                resultId.value = result.data.resultId;
            }
        }
    } catch (error) {
        console.error("식단 가져오기중 에러", error);
    } finally {
        loading.value = false;
    }
};

const getResult = async () => {
    try {
        loading.value = true;
        const result: APIResponse<{
            diet: Meal[];
            workout: string[];
            resultId: number | null;
        }> = await $fetch("/generate/support", {
            baseURL: config.public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
            body: {
                token: token.value,
            },
        });

        if (result.data != null) {
            resultDiet.value = result.data.diet;
            resultWorkout.value = result.data.workout;

            if (result.data.resultId != null) {
                resultId.value = result.data.resultId;
            }
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

const clearResult = async () => {
    resultDiet.value = null;
    resultWorkout.value = null;

    checkedItems.value = [];

    if (resultId.value != null) {
        const result: APIResponse<null> = await $fetch("/diet/log", {
            baseURL: config.public.apiBase,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
            body: {
                date: new Date().toISOString().split("T")[0],
                resultId: resultId.value ?? null,
            },
        });

        resultId.value = null;
    }
};

// watch(
//     () => resultDiet.value,
//     async (n) => {
//         await nextTick();

//         if (!n || !chartRef.value) return;

//         const chart: echarts.EChartsType = $echarts.init(chartRef.value);

//         const option: echarts.EChartsOption = {
//             tooltip: {
//                 trigger: "item",
//                 formatter: "{b}: {c}g ({d}%)",
//             },
//             legend: {
//                 bottom: "0%",
//             },
//             series: [
//                 {
//                     name: "영양소 구성",
//                     type: "pie",
//                     radius: ["40%", "70%"],
//                     avoidLabelOverlap: false,
//                     itemStyle: {
//                         borderRadius: 10,
//                         borderColor: "#fff",
//                         borderWidth: 2,
//                     },
//                     label: {
//                         show: true,
//                         position: "inside",
//                         formatter: "{b}\n{d}%",
//                         fontSize: 12,
//                     },
//                     data: [
//                         {
//                             value: totalNutrition.value.carbs,
//                             name: "탄수화물",
//                         },
//                         {
//                             value: totalNutrition.value.protein,
//                             name: "단백질",
//                         },
//                         {
//                             value: totalNutrition.value.fat,
//                             name: "지방",
//                         },
//                     ],
//                 },
//             ],
//         };

//         chart.setOption(option);
//         chart.resize();
//     }
// );
</script>
