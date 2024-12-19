declare module "nuxt/app" {
    interface NuxtApp {
        $echarts: typeof import("echarts");
    }
}
