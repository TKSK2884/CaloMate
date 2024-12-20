import { defineNuxtPlugin } from "nuxt/app";
import AOS from "aos";
import "aos/dist/aos.css";

export default defineNuxtPlugin(() => {
    AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
    });

    return {
        provide: {
            aos: AOS,
        },
    };
});
