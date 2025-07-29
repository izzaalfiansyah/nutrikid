<script lang="ts" setup>
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";
import { AuthService } from "~/services/auth/auth.service";
import type { LoginParams } from "~/services/auth/dto/login.dto";

const req = ref<LoginParams>({
  email: "",
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
    navigateTo("/");
  } catch (err) {
    error.value = "Username atau password salah.";
  }

  is_submitted.value = false;
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-5">
    <form @submit.prevent="handleLogin" class="w-[400px] max-w-full space-y-5">
      <div>
        <div class="text-2xl font-semibold">Selamat Datang 👋</div>
        <p class="text-gray-500 text-sm">
          Silahkan login ke akun anda untuk memulai sesi.
        </p>
      </div>
      <div class="space-y-4">
        <Input placeholder="Email" v-model="req.email" type="email"></Input>
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
        <Loader2 class="mr-1 animate-spin size-4" v-if="is_submitted"></Loader2>
        Login
      </Button>
      <div class="text-center text-sm text-gray-500">
        Jika anda lupa password, silahkan hubungi admin.
      </div>
    </form>
  </div>
</template>
