<template>
    <UContainer>
        <UCard class="mt-16">
            <el-menu
                :default-active="activeIndex"
                class="el-menu !bg-transparent my-2"
                mode="horizontal"
                @select="selectMenu"
            >
                <el-menu-item class="!text-inherit" index="1">
                    이전 상담 내역
                </el-menu-item>
                <el-menu-item class="!text-inherit" index="2">
                    몸무게 추세
                </el-menu-item>
            </el-menu>
            <template v-if="!loading">
                <template v-if="activeIndex == '1'">
                    <div class="text-2xl font-bold my-4">이전 상담 내역</div>
                    <div class="my-2 opacity-50">
                        이전 상담내역은 최근순으로 5개까지 표시됩니다.
                    </div>

                    <template v-if="historyList.length > 0">
                        <UCard
                            v-for="(item, index) in historyList"
                            :key="'history-' + index"
                            class="mb-4 secondary rounded-lg dark:secondary"
                        >
                            <div
                                class="cursor-pointer"
                                @click="selectContent(index)"
                            >
                                <div class="text-xl font-bold">
                                    {{
                                        convertKoreaTime(
                                            item.created_at,
                                            KoreaTimeEnum.Day
                                        )
                                    }}
                                </div>

                                <div class="text-xl font-bold">
                                    {{ item.question }}
                                </div>
                            </div>

                            <div
                                v-if="
                                    activeContent != -1 &&
                                    activeContent == index
                                "
                                v-html="convertReplacedText(item.content)"
                            />
                        </UCard>
                    </template>
                </template>

                <template v-else>
                    <div class="text-2xl font-bold my-4">몸무게 추세</div>
                    <div class="my-2 opacity-50">
                        프로필 정보를 업데이트 할때마다 몸무게 추세에
                        반영됩니다.
                    </div>
                    <div ref="chart" style="width: 100%; height: 400px" />
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
} from "~/structure/type";
import { KoreaTimeEnum } from "@/structure/type";

const config: RuntimeConfig = useRuntimeConfig();

const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const loading: Ref<boolean> = ref(true);

const { $echarts } = useNuxtApp();
const chart: Ref<HTMLDivElement | null> = ref(null);
let myChart: echarts.ECharts | null = null;

const XAxisData: Ref<string[] | undefined> = ref(undefined);
const YAxisData: Ref<number[] | undefined> = ref(undefined);

const activeIndex: Ref<string> = ref("1");
const historyList: Ref<MypageHistory[]> = ref([]);
const activeContent: Ref<number> = ref(-1);

const selectMenu = async (key: string) => {
    activeIndex.value = key;
};

const selectContent = (index: number) => {
    if (activeContent.value == index) {
        activeContent.value = -1;
        return;
    }
    activeContent.value = index;
};

onMounted(async () => {
    if (authStore?.accessToken == null) return;
    await fetchMypageHistory();
});

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
    } catch (error) {
        return;
    }
};

watch(
    () => authStore.accessToken,
    async (n) => {
        if (n != null) {
            await fetchMypageHistory();
        }
    }
);

watch(
    () => loadingStore.appInitial,
    (n) => {
        if (n) {
            if (authStore.accessToken == null) {
                ElMessage({ message: "로그인이 필요합니다.", type: "warning" });

                navigateTo("/login");
            }
        }
    }
);

watch(
    () => YAxisData.value,
    (n) => {
        if (n != null) {
            if (chart.value) {
                myChart = $echarts.init(chart.value);
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
    () => activeIndex.value,
    async (n) => {
        if (n == "2") {
            await fetchMypageProfile();
        }
    }
);
</script>
