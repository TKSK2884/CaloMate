// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    runtimeConfig: {
        public: {
            origin: process.env.VUE_APP_ORIGIN,
            apiBase: process.env.VUE_APP_API_URL || "http://localhost:8566",
            kakaoAccessKey: process.env.VUE_APP_KAKAO_ACCESS_KEY,
            kakaoRedirectURI: process.env.VUE_APP_KAKAO_REDIRECT_URI,
        },
    },

    app: {
        head: {
            title: "CaloMate AI",
            meta: [{ name: "description", content: "칼로메이트 AI입니다." }],
        },
    },

    nitro: {
        prerender: {
            crawlLinks: false,
            routes: ["/", "/login", "/signup", "/profile", "/ai"],
        },
    },

    modules: ["@nuxt/ui", "@element-plus/nuxt", "@pinia/nuxt"],

    css: ["~/assets/css/main.css", "@/assets/css/global.css"],
    compatibilityDate: "2025-03-20",
});
