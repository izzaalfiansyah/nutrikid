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
  ChartBar,
  ChevronUp,
  Home,
  User2,
  Users,
  Users2,
} from "lucide-vue-next";

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
        {
          title: "Template Saran",
          url: "/templates",
          icon: BookOpen,
        },
      ],
    },
    {
      title: "Laporan",
      url: "#",
      items: [
        {
          title: "Laporan Harian",
          url: "/daily-report",
          icon: ChartArea,
        },
        {
          title: "Laporan Bulanan",
          url: "/monthly-report",
          icon: ChartBar,
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
                  <component :is="childItem.icon" class="mr-2 size-4" />
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
                <User2 /> {{ authStore.user?.name }}
                <ChevronUp class="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              class="w-[--reka-popper-anchor-width]"
            >
              <DropdownMenuItem>
                <span class="text-gray-800">Profil</span>
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger class="w-full cursor-pointer" as-child>
                  <DropdownMenuItem @select="(e) => e.preventDefault()">
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
