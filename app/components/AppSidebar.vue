<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  ChartArea,
  ChevronUp,
  CloudDownload,
  Fingerprint,
  HandHelping,
  Home,
  LogOut,
  User2,
  Users,
  Users2,
  LockKeyholeOpen,
} from "lucide-vue-next";
import { AuthService } from "~/services/auth/auth.service";
import { UserService } from "~/services/user/user.service";
import UserStoreDialog from "./app/users/UserStoreDialog.vue";
import UserResetPasswordDialog from "./app/users/UserResetPasswordDialog.vue";

const props = defineProps<SidebarProps>();
const authStore = useAuthStore();

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      items: [
        {
          title: "Beranda",
          url: "/",
          isActive: true,
          icon: Home,
        },
      ],
    },
    {
      title: "Data Master",
      url: "#",
      items: [
        {
          title: "Data Pengguna",
          url: "/users",
          icon: Users2,
        },
        {
          title: "Data Siswa",
          url: "/students",
          icon: Users,
        },
      ],
    },
    {
      title: "Laporan",
      url: "#",
      items: [
        {
          title: "Pengukuran Gizi",
          url: "/measurements",
          icon: ChartArea,
        },
        {
          title: "Template Saran",
          url: "/templates",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "Lain-lain",
      url: "#",
      items: [
        {
          title: "Tentang Kami",
          url: "/about",
          icon: Fingerprint,
        },
        {
          title: "Bantuan",
          url: "/help",
          icon: HandHelping,
        },
        {
          title: "Download Aplikasi",
          url: "/download-apps",
          icon: CloudDownload,
        },
      ],
    },
  ],
};

function handleLogout() {
  authStore.logout();
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <div class="mt-3 flex items-center justify-center">
        <span class="text-2xl font-semibold text-primary"> NutriKid </span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <div class="mt-2"></div>
      <SidebarGroup v-for="item in data.navMain" :key="item.title">
        <SidebarGroupLabel class="text-gray-500 uppercase">{{
          item.title
        }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="childItem in item.items"
              :key="childItem.title"
            >
              <SidebarMenuButton
                as-child
                :class="{
                  'bg-primary text-white hover:bg-primary hover:text-white':
                    $route.path == childItem.url,
                }"
              >
                <NuxtLink :to="childItem.url">
                  <component
                    :is="childItem.icon"
                    :class="{
                      'text-primary': $route.path != childItem.url,
                      'mr-2 size-4': true,
                    }"
                  />
                  {{ childItem.title }}
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger class="cursor-pointer" asChild>
              <SidebarMenuButton>
                <User2 />
                <div class="truncate">
                  {{ authStore.user?.name }}
                </div>
                <ChevronUp class="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              class="w-[--reka-popper-anchor-width]"
            >
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
                  <span class="text-gray-800">Profil</span>
                </DropdownMenuItem>
              </UserStoreDialog>
              <UserResetPasswordDialog :uuid="authStore.user!.user_id">
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
                    <span class="text-gray-800">Logout</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Anda yakin akan logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Setelah melakukan aksi ini. Sesi anda akan terhapus dan
                      anda perlu untuk login kembali.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel class="cursor-pointer"
                      >Batal</AlertDialogCancel
                    >
                    <AlertDialogAction
                      @click="handleLogout"
                      class="cursor-pointer"
                      >Oke</AlertDialogAction
                    >
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
