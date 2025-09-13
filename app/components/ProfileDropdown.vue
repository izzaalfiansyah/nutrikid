<script lang="ts" setup>
import { LockKeyholeOpen, LogOut, User2 } from "lucide-vue-next";
import { AuthService } from "~/services/auth/auth.service";
import UserStoreDialog from "./users/UserStoreDialog.vue";
import UserResetPasswordDialog from "./users/UserResetPasswordDialog.vue";

const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="cursor-pointer" asChild>
      <slot></slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="top" class="w-[--reka-popper-anchor-width]">
      <UserStoreDialog
        :callback="AuthService.profile"
        :user="authStore.user!"
        caption="Profil Saya"
      >
        <DropdownMenuItem
          @select="(e) => e.preventDefault()"
          class="flex items-center gap-2"
        >
          <User2 class="size-4"></User2>
          <span class="text-gray-800 dark:text-white">Profil</span>
        </DropdownMenuItem>
      </UserStoreDialog>
      <UserResetPasswordDialog :id="authStore.user!.id">
        <DropdownMenuItem
          @select="(e) => e.preventDefault()"
          class="flex items-center gap-2"
        >
          <LockKeyholeOpen class="size-4" />
          <span>Reset Password</span>
        </DropdownMenuItem>
      </UserResetPasswordDialog>
      <AlertDialog>
        <AlertDialogTrigger class="w-full cursor-pointer" as-child>
          <DropdownMenuItem
            @select="(e) => e.preventDefault()"
            class="flex items-center gap-2"
          >
            <LogOut class="size-4"></LogOut>
            <span class="text-gray-800 dark:text-white">Logout</span>
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin akan logout?</AlertDialogTitle>
            <AlertDialogDescription>
              Setelah melakukan aksi ini. Sesi anda akan terhapus dan anda perlu
              untuk login kembali.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel class="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction @click="handleLogout" class="cursor-pointer"
              >Oke</AlertDialogAction
            >
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
