<template>
    <div>
        <UButton
            v-if="colorMode.preference == ThemeColor.Dark"
            icon="i-heroicons-sun"
            color="gray"
            variant="ghost"
            @click="getPreference(ThemeColor.Light)"
        />
        <UButton
            v-if="colorMode.preference == ThemeColor.Light"
            icon="i-heroicons-moon"
            color="gray"
            variant="ghost"
            @click="getPreference(ThemeColor.Dark)"
        />
    </div>
</template>

<script setup lang="ts">
import { ThemeColor } from "~/structure/theme";

const colorMode = useColorMode();

const getPreference = (color: ThemeColor) => {
    colorMode.preference = color;
};
</script>
