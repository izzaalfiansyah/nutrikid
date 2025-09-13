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
  ChartArea,
  ChevronUp,
  Fingerprint,
  Home,
  User2,
  Users,
  Users2,
  Building,
} from "lucide-vue-next";
import { app } from "~/lib/app";

const props = defineProps<SidebarProps>();
const authStore = useAuthStore();

function isMenuActive(path: string) {
  const route = useRoute();

  if (path == "/" && route.path != "/") {
    return false;
  }

  if (route.path.startsWith(path)) {
    return true;
  }

  return false;
}

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
          title: "Data Sekolah",
          url: "/schools",
          icon: Building,
          roles: ["admin"],
          hidden: !!authStore.user?.school_id,
        },
        {
          title: "Data Pengguna",
          url: "/users",
          icon: Users2,
          roles: ["admin"],
          hidden: !!authStore.user?.school_id,
        },
        {
          title: `Data Siswa`,
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
        // {
        //   title: "Template Saran",
        //   url: "/suggestions",
        //   icon: BookOpen,
        // },
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
      ],
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <div class="mt-3 flex items-center justify-center space-x-4">
        <Logo class="size-7"></Logo>
        <span class="text-2xl font-semibold text-primary">
          {{ app().name }}
        </span>
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
            <template v-for="childItem in item.items" :key="childItem.title">
              <SidebarMenuItem
                v-if="
                  (!(childItem as any)?.roles ||
                    (childItem as any)?.roles.includes(authStore.user?.role)) &&
                  !(childItem as any).hidden
                "
              >
                <SidebarMenuButton
                  as-child
                  :class="{
                    'bg-primary text-white hover:bg-primary hover:text-white':
                      isMenuActive(childItem.url),
                  }"
                >
                  <NuxtLink :to="childItem.url">
                    <component
                      :is="childItem.icon"
                      :class="{
                        'text-primary': !isMenuActive(childItem.url),
                        'mr-2 size-4': true,
                      }"
                    />
                    {{ childItem.title }}
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <ProfileDropdown>
            <SidebarMenuButton>
              <User2 />
              <div class="truncate">
                {{ authStore.user?.name }}
              </div>
              <ChevronUp class="ml-auto" />
            </SidebarMenuButton>
          </ProfileDropdown>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
