<script lang="ts" setup>
const homeStore = useHomeStore();

onMounted(() => {
  homeStore.setTitle("Beranda");
});
</script>

<template>
  <div class="flex items-stretch min-h-screen gap-4">
    <div class="w-1/3">
      <Card class="h-full" />
    </div>
    <div class="w-1/3">
      <Card class="h-full" />
    </div>
    <div class="w-1/3">
      <Card class="h-full" />
    </div>
  </div>
</template>
