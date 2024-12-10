<template>
    <div class="min-h-screen bg-background text-foreground">
        <div class="container mx-auto px-4 py-12">
            <div class="text-center mb-16">
                <div class="text-4xl font-bold mb-4">
                    당신만의 개인 피트니스 트레이너
                </div>
                <div class="text-xl mb-8">
                    맞춤형 운동 계획, 식단 관리, 그리고 지속적인 동기부여로
                    당신의 건강 목표를 달성하세요.
                </div>
                <NuxtLink to="/profile">
                    <UButton
                        class="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full text-lg"
                    >
                        프로필 입력하기
                    </UButton>
                </NuxtLink>
            </div>

            <div class="grid md:grid-cols-2 gap-12 mb-16">
                <div
                    class="bg-card p-8 rounded-lg shadow-md dark:shadow-white/10"
                >
                    <DumbbellIcon class="w-12 h-12 mb-4" />
                    <h3 class="text-2xl font-semibold mb-4">
                        맞춤형 운동 계획
                    </h3>
                    <p class="text-muted-foreground">
                        당신의 목표와 현재 상태에 맞는 최적의 운동 루틴을
                        제공합니다.
                    </p>
                </div>
                <div
                    class="bg-card p-8 rounded-lg shadow-md dark:shadow-white/10"
                >
                    <UtensilsIcon class="w-12 h-12 text-primary mb-4" />
                    <h3 class="text-2xl font-semibold mb-4">
                        개인화된 식단 계획
                    </h3>
                    <p class="text-muted-foreground">
                        영양 균형을 고려한 맞춤형 식단으로 건강한 식습관을
                        만들어갑니다.
                    </p>
                </div>
                <div
                    class="bg-card p-8 rounded-lg shadow-md dark:shadow-white/10"
                >
                    <ChartLineIcon class="w-12 h-12 text-primary mb-4" />
                    <h3 class="text-2xl font-semibold mb-4">진행 상황 추적</h3>
                    <p class="text-muted-foreground">
                        데이터 기반의 분석으로 당신의 건강 여정을 시각화하고
                        관리합니다.
                    </p>
                </div>
                <div
                    class="bg-card p-8 rounded-lg shadow-md dark:shadow-white/10"
                >
                    <TrophyIcon class="w-12 h-12 text-primary mb-4" />
                    <h3 class="text-2xl font-semibold mb-4">
                        지속적인 동기부여
                    </h3>
                    <p class="text-muted-foreground">
                        목표 달성에 따른 보상과 챌린지로 꾸준한 동기를
                        제공합니다.
                    </p>
                </div>
            </div>

            <div
                class="bg-card p-8 rounded-lg shadow-md dark:shadow-white/10 text-center"
            >
                <h3 class="text-2xl font-semibold mb-4">
                    지금 바로 시작하세요
                </h3>
                <div class="mb-4 text-muted-foreground">
                    <template v-if="!isLogin()">
                        회원 가입하고 <b>CaloMate AI</b>와 함께 건강한 삶을
                        만들어 가세요.
                    </template>
                </div>
                <div
                    class="flex flex-col md:flex-row justify-center items-center gap-4"
                >
                    <template v-if="!isLogin()">
                        <NuxtLink to="/signup">
                            <UButton
                                class="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                무료 회원가입
                            </UButton>
                        </NuxtLink>
                        <p class="text-sm text-muted-foreground">
                            이미 계정이 있으신가요?
                            <NuxtLink
                                to="/login"
                                class="text-primary hover:underline"
                            >
                                로그인
                            </NuxtLink>
                        </p>
                    </template>
                    <template v-else>
                        <NuxtLink to="/dashboard">
                            <UButton
                                class="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full text-lg"
                            >
                                시작하기
                            </UButton>
                        </NuxtLink>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layoutStyle: "home",
});

const authStore = useAuthStore();

const isLogin = (): boolean => {
    return authStore.accessToken != null;
};
</script>
