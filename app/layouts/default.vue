<script lang="ts">
export const iframeHeight = "800px";
</script>

<script setup lang="ts">
import { Home } from "lucide-vue-next";

const authStore = useAuthStore();
const homeStore = useHomeStore();
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 bg-primary shrink-0 items-center gap-2 border-b px-4"
      >
        <SidebarTrigger class="-ml-1 cursor-pointer text-white" />
        <Separator orientation="vertical" class="mr-2 text-primary/50 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink
                to="/"
                class="cursor-pointer text-white"
                as="nuxt-link"
              >
                <Home class="size-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block text-white" />
            <BreadcrumbItem>
              <BreadcrumbPage class="text-white">{{
                homeStore.title
              }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="ml-auto flex items-center mr-2">
          <ProfileDropdown>
            <button
              type="button"
              class="cursor-pointer flex md:space-x-3 items-center"
            >
              <Avatar>
                <AvatarFallback>
                  {{ letterName(authStore.user?.name) }}
                </AvatarFallback>
              </Avatar>
              <span class="hidden md:block text-sm text-white">
                {{ authStore.user?.name }}
              </span>
            </button>
          </ProfileDropdown>
        </div>
      </header>
      <main class="p-4">
        <slot></slot>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
