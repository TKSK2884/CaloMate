<template>
    <div class="bg-gradient-to-b from-green-50 to-white text-foreground">
        <div class="max-w-3xl mx-auto px-4 py-28 text-center">
            <div class="text-center mb-16">
                <div
                    class="text-4xl sm:text-5xl font-extrabold leading-tight mb-6"
                >
                    <span class="text-green-600">AI</span>
                    <span class="text-primary-second"> 가 제안하는 </span>
                    <br class="sm:hidden" />
                    <span class="text-primary-second">나만의 건강 플랜</span>
                </div>
                <div class="text-lg sm:text-xl text-gray-600 mb-10">
                    식단, 운동, 몸무게까지!<br class="sm:hidden" />
                    당신의 라이프스타일을
                    <span class="font-semibold">AI와 함께</span> 개선해보세요.
                </div>

                <NuxtLink :to="authStore.accessToken ? '/mypage' : '/profile'">
                    <UButton
                        class="bg-second text-white hover:bg-second/90 px-8 py-3 text-lg rounded-full shadow-lg transition"
                    >
                        지금 시작하기
                    </UButton>
                </NuxtLink>

                <div class="text-sm text-gray-500 mt-6">
                    AI 추천은 비회원 상태에서도 가능합니다.<br />
                    로그인 하시면 진행 결과가 저장됩니다.
                </div>

                <div class="mt-12">
                    <img
                        src="@/assets/healthy.svg"
                        alt="AI 건강 추천 일러스트"
                        class="w-[80%] max-w-md mx-auto"
                    />
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
</script>
