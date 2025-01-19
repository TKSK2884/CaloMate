<template>
    <div class="bg-background text-foreground">
        <div class="mx-auto px-2 py-32">
            <div class="text-center mb-16">
                <div class="text-3xl font-bold mb-4 sm:text-4xl">
                    당신만의
                    <div class="block sm:hidden" />
                    개인 피트니스 트레이너
                </div>
                <div class="text-lg mb-8 sm:text-xl">
                    맞춤형 운동 계획, 식단 관리,
                    <div class="block lg:hidden" />
                    그리고 지속적인 동기부여로
                    <br />
                    당신의 건강 목표를 달성하세요.
                </div>
                <NuxtLink to="/profile">
                    <UButton
                        class="bg-second text-primary-foreground hover:bg-second/90 px-8 py-3 rounded-full text-lg"
                    >
                        시작하기
                    </UButton>
                </NuxtLink>

                <div class="text-center my-8 opacity-50">
                    AI 상담은 비회원 상태에서도 가능합니다.
                    <br />
                    로그인 하시면 진행 결과를 보관할 수 있습니다.
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
