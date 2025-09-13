<script lang="ts" setup>
import { Loader2 } from "lucide-vue-next";
import { AuthService } from "./services/auth/auth.service";
import "vue-sonner/style.css";
import { app } from "./lib/app";

const is_loaded = ref(false);
const route = useRoute();

async function getProfile() {
  try {
    const user = await AuthService.profile();
    const isLoggedIn = user?.id;

    if (!isLoggedIn && !["/login", "/about"].includes(route.path)) {
      return navigateTo("/login");
    } else if (isLoggedIn && route.path == "/login") {
      // return navigateTo("/");
    }
  } catch (err) {
    if (route.path != "/about") {
      return navigateTo("/login");
    }
  }
}

onMounted(async () => {
  await getProfile();

  setTimeout(() => {
    is_loaded.value = true;
  }, 400);
});
</script>

<template>
  <Head>
    <Title
      >{{ app().name }} - Aplikasi Digital Monitoring Status Gizi Anak</Title
    >
    <Meta name="description" :content="app().description"></Meta>
  </Head>

  <Body>
    <template v-if="!is_loaded">
      <div
        class="h-screen fixed bg-white dark:bg-black top-0 left-0 bottom-0 right-0 z-[99999] flex items-center justify-center"
      >
        <div class="text-center animate-pulse">
          <Logo class="size-14 inline"></Logo>
          <div class="text-center text-primary font-semibold mt-2 text-xl">
            {{ app().name }}
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <NuxtLayout>
        <NuxtPage></NuxtPage>
      </NuxtLayout>

      <ClientOnly>
        <Toaster position="bottom-right"></Toaster>
      </ClientOnly>
    </template>
  </Body>
</template>
