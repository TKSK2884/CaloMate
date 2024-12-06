// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            apiBase: process.env.VUE_APP_API_URL || "http://localhost:8566",
        },
    },
    modules: ["@nuxt/ui", "@element-plus/nuxt"],

    colorMode: {
        preference: "light", // default value of $colorMode.preference
        fallback: "light", // fallback value if not system preference found
        hid: "nuxt-color-mode-script",
        globalName: "__NUXT_COLOR_MODE__",
        componentName: "ColorScheme",
        classPrefix: "",
        classSuffix: "-mode",
        storageKey: "nuxt-color-mode",
    },

    css: ["~/assets/css/main.css", "@/assets/css/global.css"],
});
