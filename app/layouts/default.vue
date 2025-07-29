<script lang="ts">
export const iframeHeight = "800px";
export const description =
  "A simple sidebar with navigation grouped by section.";
</script>

<script setup lang="ts">
import { Home, LogOut } from "lucide-vue-next";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        class="flex h-16 bg-white shrink-0 items-center gap-2 border-b px-4"
      >
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink href="/" class="cursor-pointer" as="nuxt-link">
                <Home class="size-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="ml-auto flex items-center">
          <button type="button" class="cursor-pointer">
            <LogOut class="size-4"></LogOut>
          </button>
        </div>
      </header>
      <main class="p-4">
        <slot></slot>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
