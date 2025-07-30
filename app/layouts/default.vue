<script lang="ts">
export const iframeHeight = "800px";
</script>

<script setup lang="ts">
import { Home } from "lucide-vue-next";
import { letterName } from "~/services/auth/dto/profile.dto";

const authStore = useAuthStore();
const homeStore = useHomeStore();
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 bg-white shrink-0 items-center gap-2 border-b px-4"
      >
        <SidebarTrigger class="-ml-1 cursor-pointer" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink to="/" class="cursor-pointer" as="nuxt-link">
                <Home class="size-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{{ homeStore.title }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="ml-auto flex items-center mr-2">
          <button
            type="button"
            class="cursor-pointer flex md:space-x-3 items-center"
          >
            <Avatar>
              <AvatarFallback>{{
                letterName(authStore.user?.name)
              }}</AvatarFallback>
            </Avatar>
            <span class="hidden md:block text-sm">
              {{ authStore.user?.name }}
            </span>
          </button>
        </div>
      </header>
      <main class="p-4">
        <slot></slot>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
