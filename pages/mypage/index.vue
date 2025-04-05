<template>
    <UContainer class="max-w-screen-lg">
        <UCard class="my-16">
            <!-- TabsList -->
            <div
                class="grid grid-cols-2 w-full mb-4 border rounded-xl overflow-hidden"
            >
                <button
                    :class="[
                        'px-4 py-2 text-center text-sm font-medium transition-colors',
                        activeIndex === '1'
                            ? 'bg-second text-primary-foreground'
                            : 'text-primary',
                    ]"
                    @click="activeIndex = '1'"
                >
                    대시 보드
                </button>

                <button
                    :class="[
                        'px-4 py-2 text-center text-sm font-medium transition-colors',
                        activeIndex === '2'
                            ? 'bg-second text-primary-foreground'
                            : 'text-primary',
                    ]"
                    @click="activeIndex = '2'"
                >
                    이전 추천 내역
                </button>
            </div>
            <template v-if="!loading">
                <template v-if="activeIndex == '1'">
                    <div class="text-2xl font-bold my-4">몸무게 추세</div>
                    <template v-if="authStore.userProfile != null">
                        <div class="my-2 opacity-50">
                            프로필 정보를 업데이트 할때마다 몸무게 추세에
                            반영됩니다.
                        </div>
                        <div ref="chart" style="width: 100%; height: 400px" />
                        <div class="mb-2 opacity-50">몸무게 입력(kg)</div>
                        <div class="flex mb-4">
                            <UInput
                                v-model="weight"
                                class="mr-4"
                                type="number"
                            />
                            <UButton
                                @click="saveWeightInfo"
                                class="bg-second text-primary-foreground hover:bg-second/90"
                            >
                                입력
                            </UButton>
                        </div>
                        <div class="text-2xl font-bold my-4">
                            주간 식단 이행률
                        </div>
                        <div class="my-2 opacity-50">
                            추천 식단을 완료할때마다 주간 식단 이행률에
                            반영됩니다.
                        </div>
                        <div ref="chart2" style="width: 100%; height: 400px" />
                    </template>
                    <template v-else>
                        <div class="my-2 opacity-50">
                            프로필이 등록되지 않았습니다. 프로필을 먼저 등록해
                            주세요.
                        </div>

                        <NuxtLink to="/profile">
                            <UButton
                                class="bg-second text-primary-foreground hover:bg-second/90"
                            >
                                프로필 등록하러 가기
                            </UButton>
                        </NuxtLink>
                    </template>
                </template>

                <template v-else>
                    <div class="text-2xl font-bold my-4">이전 추천 내역</div>
                    <div class="my-2 opacity-50">
                        추천 내역은 최근순으로 5개까지 표시됩니다.
                    </div>

                    <template v-if="historyList.length > 0">
                        <UCard
                            v-for="(item, index) in historyList"
                            :key="'history-' + index"
                            class="mb-4 secondary rounded-lg dark:secondary"
                        >
                            <div
                                @click="selectContent(index)"
                                class="cursor-pointer mb-2"
                            >
                                <div
                                    class="text-xl font-bold flex justify-between items-center"
                                >
                                    {{
                                        convertKoreaTime(
                                            item.created_at,
                                            KoreaTimeEnum.Day
                                        )
                                    }}
                                    <span class="text-sm text-gray-400">
                                        {{
                                            activeContent === index
                                                ? "닫기 ▲"
                                                : "펼치기 ▼"
                                        }}
                                    </span>
                                </div>
                            </div>

                            <div
                                v-if="
                                    activeContent != -1 &&
                                    activeContent == index
                                "
                                class="transition-all"
                            >
                                <div class="grid gap-4 md:grid-cols-3">
                                    <div
                                        v-for="(i, index) in JSON.parse(
                                            item.content
                                        ).diet"
                                        :key="'result-' + index"
                                        class="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                                    >
                                        <div
                                            class="font-bold text-gray-700 text-base mb-2"
                                        >
                                            {{ i.meal }}
                                        </div>
                                        <ul
                                            class="text-sm text-gray-700 space-y-1"
                                        >
                                            <li>
                                                칼로리: {{ i.calories }} kcal
                                            </li>
                                            <li>탄수화물: {{ i.carbs }}g</li>
                                            <li>단백질: {{ i.protein }}g</li>
                                            <li>지방: {{ i.fat }}g</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="mt-8">
                                    <div class="text-xl font-semibold mb-4">
                                        운동 추천
                                    </div>
                                    <ul
                                        class="list-disc pl-6 text-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                                    >
                                        <li
                                            v-for="(workout, idx) in JSON.parse(
                                                item.content
                                            ).workout"
                                            :key="'workout-' + idx"
                                        >
                                            {{ workout }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </UCard>
                    </template>
                </template>
            </template>
            <template v-else>
                <div class="flex items-center justify-center min-h-32">
                    <div
                        class="w-16 h-16 border-4 border-zinc-500 border-t-transparent rounded-full animate-spin"
                    />
                </div>
            </template>
        </UCard>
    </UContainer>
</template>

<script setup lang="ts">
import type { EChartsOption } from "echarts";
import type { RuntimeConfig } from "nuxt/schema";
import type {
    APIResponse,
    MypageHistory,
    MypageProfile,
    WeekdayStats,
} from "~/structure/type";
import { KoreaTimeEnum } from "@/structure/type";

const config: RuntimeConfig = useRuntimeConfig();

const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const loading: Ref<boolean> = ref(false);

const { $echarts } = useNuxtApp();

const chart: Ref<HTMLDivElement | null> = ref(null);
const chart2: Ref<HTMLDivElement | null> = ref(null);

let myChart: echarts.ECharts | null = null;
let myChart2: echarts.ECharts | null = null;

const XAxisData: Ref<string[] | undefined> = ref(undefined);
const YAxisData: Ref<number[] | undefined> = ref(undefined);

const XAxisData2: Ref<string[] | undefined> = ref(undefined);
const YAxisData2: Ref<number[] | undefined> = ref(undefined);

const activeIndex: Ref<string> = ref("1");
const historyList: Ref<MypageHistory[]> = ref([]);
const activeContent: Ref<number> = ref(-1);
const weight: Ref<number> = ref(0);

const selectContent = (index: number) => {
    if (activeContent.value == index) {
        activeContent.value = -1;
        return;
    }

    activeContent.value = index;
};

onMounted(async () => {
    if (authStore.accessToken == null) {
        ElMessage({ message: "로그인이 필요합니다.", type: "warning" });

        navigateTo("/login");
    }

    await fetchDashboard();

    if (process.server) return;
    window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
    if (process.server) return;

    window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
    myChart?.resize();
    myChart2?.resize();
};

const fetchMypageProfile = async () => {
    try {
        const result: APIResponse<MypageProfile[]> = await $fetch(
            "/mypage/profile",
            {
                baseURL: config.public.apiBase,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            }
        );

        XAxisData.value = result.data.map((item) => {
            return convertKoreaTime(item.created_at);
        });

        YAxisData.value = result.data.map((item) => {
            return item.weight;
        });

        if (YAxisData.value != null) {
            const lastValue: number | undefined = YAxisData.value.at(-1);
            if (lastValue != null) {
                weight.value = lastValue;
            }
        }
    } catch (error) {
        return;
    }
};

const fetchMypageChart = async () => {
    const result: APIResponse<WeekdayStats[]> = await $fetch("/mypage/chart", {
        baseURL: config.public.apiBase,
        method: "GET",
        headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
        },
    });

    XAxisData2.value = result.data.map((item) => {
        return item.date;
    });

    YAxisData2.value = result.data.map((item) => {
        return item.rate;
    });
};

const fetchMypageHistory = async () => {
    try {
        loading.value = true;

        const result: APIResponse<MypageHistory[]> = await $fetch(
            "/mypage/history",
            {
                baseURL: config.public.apiBase,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            }
        );

        historyList.value = result.data;
    } catch (error) {
        return;
    } finally {
        loading.value = false;
    }
};

const saveWeightInfo = async () => {
    if (weight.value == null || weight.value < 1) {
        ElMessage({ message: "올바른 체중을 입력해주세요", type: "warning" });
        return;
    }

    if (XAxisData.value == null || YAxisData.value == null) {
        return;
    }

    try {
        const result: APIResponse<null> = await $fetch("/mypage/save", {
            baseURL: config.public.apiBase,
            method: "POST",
            headers: {
                Authorization: `Bearer ${authStore.accessToken}`,
            },
            body: {
                weight: weight.value,
            },
        });

        // 차트에 데이터를 선 반영
        const now = new Date();

        XAxisData.value.push(convertKoreaTime(now));
        YAxisData.value.push(weight.value);

        if (authStore.userProfile != null) {
            authStore.userProfile.weight = weight.value;
        }

        YAxisData.value = [...YAxisData.value];
    } catch {
        return;
    }
};

watch(
    () => authStore.accessToken,
    async (n) => {
        if (n != null) {
            await fetchMypageProfile();
        }
    }
);

watch(
    () => YAxisData.value,
    (n) => {
        if (n != null) {
            if (chart.value) {
                if (!myChart) {
                    myChart = $echarts.init(chart.value);
                }
            }

            if (myChart) {
                const option: EChartsOption = {
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "line",
                        },
                    },
                    xAxis: {
                        type: "category",
                        data: XAxisData.value,
                    },
                    yAxis: {
                        type: "value",
                    },
                    series: [
                        {
                            data: n,
                            type: "line",
                            smooth: true,
                        },
                    ],
                };
                myChart.setOption(option, { notMerge: true });
            }
        }
    }
);

watch(
    () => YAxisData2.value,
    (n) => {
        if (n != null) {
            if (chart2.value) {
                if (!myChart2) {
                    myChart2 = $echarts.init(chart2.value);
                }
            }

            if (myChart2) {
                const option: EChartsOption = {
                    xAxis: {
                        type: "category",
                        data: XAxisData2.value,
                    },
                    yAxis: {
                        type: "value",
                    },
                    series: [
                        {
                            data: n,
                            type: "bar",
                            showBackground: true,
                            backgroundStyle: {
                                color: "rgba(180, 180, 180, 0.2)",
                            },
                        },
                    ],
                };
                myChart2.setOption(option, { notMerge: true });
            }
        }
    }
);

const fetchDashboard = async () => {
    await fetchMypageChart();
    await fetchMypageProfile();
};

watch(
    () => activeIndex.value,
    async (n) => {
        if (n == "1") {
            await fetchDashboard();
        }

        if (n == "2") {
            await fetchMypageHistory();
            myChart = null;
            myChart2 = null;
        }
    }
);

watch(activeIndex, (n) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>
