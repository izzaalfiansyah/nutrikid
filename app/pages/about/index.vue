<script setup lang="ts">
import { Apple, ArrowLeft, Smartphone } from "lucide-vue-next";
import { app } from "~/lib/app";

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="fixed top-2 left-2">
    <Button type="button" @click="$router.back" variant="outline">
      <ArrowLeft class="size-5"></ArrowLeft>
      <span class="md:inline hidden">Kembali</span>
    </Button>
  </div>
  <div
    class="absolute top-0 right-0 size-52 rounded-full bg-primary/25 blur-2xl"
  ></div>
  <div
    class="absolute bottom-0 left-20 lg:size-100 size-30 transition rounded-full bg-primary/25 blur-2xl"
  ></div>
  <div
    class="min-h-screen w-[800px] max-w-full flex items-center justify-center mx-auto p-5 relative"
  >
    <div class="text-center space-y-5">
      <div class="text-5xl text-primary font-semibold">
        {{ app().name }}
      </div>
      <div class="text-muted-foreground text-sm">
        {{ app().description }}
      </div>
      <div>
        <div class="mb-3 font-semibold text-sm">Download Segera:</div>
        <div class="flex items-center justify-center gap-4">
          <a href="https://github.com/izzaalfiansyah" target="_blank">
            <Button type="button" class="cursor-pointer">
              <Smartphone class="inline mr-1 size-4"></Smartphone>
              Android
            </Button>
          </a>
          <a href="https://github.com/izzaalfiansyah" target="_blank">
            <Button type="button" variant="outline" class="cursor-pointer">
              <Apple class="inline mr-1 size-4"></Apple>
              iPhone
            </Button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
