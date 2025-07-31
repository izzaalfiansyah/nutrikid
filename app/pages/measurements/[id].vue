<script lang="ts" setup>
const homeStore = useHomeStore();
const route = useRoute();
const id = route.params.id;

if (id == "create") {
}

onMounted(() => {
  const title = id == "create" ? "Tambah" : "Edit";
  homeStore.setTitle(`${title} Pengukuran`);
});
</script>

<template>
  <Card>
    <CardContent> </CardContent>
  </Card>
</template>
