<script lang="ts" setup>
import { Eye, EyeOff, Loader2, SquareArrowOutUpRight } from "lucide-vue-next";
import { AuthService } from "~/services/auth/auth.service";
import type { LoginParams } from "~/services/auth/dto/login.dto";
import LoginSvg from "~/assets/login.svg";
import { handleSuccess } from "~/lib/handle-success";
import { app } from "~/lib/app";

const req = ref<LoginParams>({
  username: "",
  password: "",
});

const show_password = ref(false);
const is_submitted = ref(false);
const error = ref("");

function togglePasswordVisibility() {
  show_password.value = !show_password.value;
}

async function handleLogin() {
  error.value = "";
  is_submitted.value = true;

  try {
    await AuthService.login(req.value);
    const authStore = useAuthStore();

    handleSuccess(`Selamat datang di ${app().name}, ${authStore.user!.name}.`);

    navigateTo("/");
  } catch (err: any) {
    error.value = (err?.message || err).toString();
  }

  is_submitted.value = false;
}

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="flex items-stretch justify-center min-h-screen p-5 relative">
    <div class="w-1/2 lg:block hidden">
      <div
        class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden"
      >
        <img :src="LoginSvg" class="w-[400px] relative" alt="" />
      </div>
    </div>
    <div class="lg:w-1/2 w-full flex justify-center items-center lg:bg-white">
      <form
        @submit.prevent="handleLogin"
        class="max-w-full space-y-5 relative w-[400px] bg-white lg:shadow-none lg:bg-transparent rounded shadow px-5 py-20"
      >
        <div>
          <div class="text-2xl font-semibold">Selamat Datang 👋</div>
          <p class="text-gray-500 text-sm">
            Silahkan login ke akun anda untuk memulai sesi.
          </p>
        </div>
        <div class="space-y-4">
          <Input placeholder="Username" v-model="req.username"></Input>
          <div class="relative">
            <Input
              placeholder="Password"
              class="pr-10"
              v-model="req.password"
              :type="show_password ? 'text' : 'password'"
            ></Input>
            <div
              class="absolute inset-y-0 right-3 flex items-center justify-center"
            >
              <button
                type="button"
                class="cursor-pointer"
                @click="togglePasswordVisibility"
              >
                <component
                  :is="show_password ? Eye : EyeOff"
                  class="size-4"
                ></component>
              </button>
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>
        </div>
        <Button
          class="w-full cursor-pointer"
          :disabled="is_submitted"
          type="submit"
        >
          <Loader2
            class="mr-1 animate-spin size-4"
            v-if="is_submitted"
          ></Loader2>
          Login
        </Button>
        <div class="text-center text-sm text-gray-500">
          Jika anda lupa password, silahkan hubungi admin.
          <NuxtLink
            to="/about"
            class="text-center text-sm underline text-primary mt-1"
          >
            Tentang Kami
            <SquareArrowOutUpRight
              class="size-3 ml-1 inline"
            ></SquareArrowOutUpRight>
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>
