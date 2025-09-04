<script setup lang="ts">
import { Apple, ArrowLeft, Smartphone, Users2 } from "lucide-vue-next";
import { app } from "~/lib/app";

const config = useRuntimeConfig();
const teamStore = useTeamStore();

const android_download_url = config.public.ANDROID_DOWNLOAD_URL;
const ios_download_url = config.public.IOS_DOWNLOAD_URL;

definePageMeta({
  layout: "auth",
});

onMounted(() => {
  teamStore.fetchTeams();
});
</script>

<template>
  <div class="fixed top-2 left-2 z-10">
    <Button
      type="button"
      @click="$router.back()"
      variant="outline"
      class="cursor-pointer"
    >
      <ArrowLeft class="size-5"></ArrowLeft>
      <span class="md:inline hidden">Kembali</span>
    </Button>
  </div>
  <div class="lg:h-screen min-h-screen p-5 relative overflow-hidden">
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
        <div class="flex items-center justify-center space-x-5">
          <Logo class="size-14"></Logo>
          <div class="text-5xl text-primary font-semibold">
            {{ app().name }}
          </div>
        </div>
        <div class="text-muted-foreground text-sm">
          {{ app().description }}
        </div>
        <div>
          <div class="mb-3 font-semibold text-sm">Download Segera:</div>
          <div class="flex items-center justify-center gap-4">
            <a :href="android_download_url" target="_blank">
              <Button type="button" class="cursor-pointer">
                <Smartphone class="inline mr-1 size-4"></Smartphone>
                Android
              </Button>
            </a>
            <a :href="ios_download_url" target="_blank">
              <Button type="button" variant="outline" class="cursor-pointer">
                <Apple class="inline mr-1 size-4"></Apple>
                iPhone
              </Button>
            </a>
          </div>
        </div>
        <div class="flex items-center justify-center pt-10">
          <div class="text-center">
            <div class="text-sm text-muted-foreground mb-2">
              Dipersembahkan oleh:
            </div>
            <img src="/polije-copyright.png" class="h-12 block" alt="" />
          </div>
        </div>
        <div class="text-center flex justify-center pt-10">
          <Dialog>
            <DialogTrigger as-child>
              <button
                class="h-10 px-4 flex items-center justify-center space-x-2 rounded-full border text-sm"
                type="button"
              >
                <Users2 class="size-5 text-primary"></Users2>
                <span class="ml-1">Tim Kami</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle class="mb-2">Tim Kami</DialogTitle>
              <template v-for="team in teamStore.teams">
                <div class="flex items-center justify-start space-x-3">
                  <img
                    :src="team.image"
                    :alt="team.name"
                    class="size-14 rounded-full object-cover border"
                  />
                  <div class="text-base">
                    {{ team.name }}
                    <div class="text-sm text-muted-foreground">
                      Jurusan Kesehatan
                    </div>
                  </div>
                </div>
              </template>
              <div class="mt-3 flex items-center justify-end">
                <DialogClose>
                  <Button type="button" variant="outline">Tutup</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
</template>
